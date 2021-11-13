import React from "react";
import { useEffect, useState } from "react";
import "../App.scss";
import "./_announcements.scss";
import { updateWebSocket } from "../util";
import { PanelHeader } from "./componentUtil.js";
import { SlackMessage } from "./SlackRenderer/components/SlackMessage.jsx";

function PanelAnnouncements(props) {
    const context = {
        getUser(id) {
          return new Promise(() => {});
        },
        getGroup(id) {
          return new Promise(() => {});
        },
        getChannel(id) {
          return new Promise(() => {});
        },
        workspaceEmoji: {},
    };

    const [announcement, setAnnouncement] = useState({ts:0});

    function update_announcement() {
        fetch("/api/components/announcements/message").then(function (r) {
            r.json().then(function (d) {
                setAnnouncement(d);
            });
        });
    }
    useEffect(function () {
        updateWebSocket.addEventListener("announcement.message", update_announcement);
        return () =>
            updateWebSocket.removeEventListener(
                "announcement.message",
                update_announcement
            );
    });
    useEffect(function () {
        update_announcement();
    }, []);
    return (
        <div className="panel announcements shadow" style={{ gridArea: "announcements" }}>
            <PanelHeader title="Announcements" />
            <div className="announcement-area">{(function (announcement, context) {
                if (announcement.ts > 0) {
                    return <SlackMessage {...announcement} context={context} key={announcement.ts} />;
                }
                return '';
            })(announcement, context)}</div>
        </div>
    );
}

export default PanelAnnouncements;
