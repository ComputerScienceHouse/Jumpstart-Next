import React from "react";
import {useEffect, useState, useLayoutEffect} from "react";
import "../App.scss";
import {updateWebSocket, datetimeExpanded} from "../util";
import {PanelHeader} from "./componentUtil.js";

function Event(props) {
    // event, vHeight, dLength
    var e = props.event;
    var edt = datetimeExpanded(new Date(e.start.timestamp * 1000));
    return (
        <div
            className="event shadow"
            id={e.id}
            style={{
                height:
                    64 +
                    (Math.floor(props.vHeight / props.dLength) - 64) -
                    5 +
                    "px",
            }}
        >
            <span className="title">{e.summary}</span>
            <span className="time">
                {e.ongoing
                    ? " --- "
                    : e.startsIn.days > 0
                    ? e.startsIn.days +
                      " day" +
                      (e.startsIn.days > 1 ? "s" : "") +
                      " (" +
                      edt.date +
                      ")"
                    : e.startsIn.hours > 0
                    ? e.startsIn.hours +
                      " hour" +
                      (e.startsIn.hours > 1 ? "s" : "") +
                      " (" +
                      edt.time +
                      ")"
                    : e.startsIn.minutes > 0
                    ? e.startsIn.minutes +
                      " minute" +
                      (e.startsIn.minutes > 1 ? "s" : "") +
                      " (" +
                      edt.time +
                      ")"
                    : "-_-"}
            </span>
        </div>
    );
}

function PanelCalendar(props) {
    const [events, setEvents] = useState([]);

    function update_calendar() {
        fetch("/api/components/calendar/events").then(function (r) {
            r.json().then(function (d) {
                var vHeight = Math.floor(window.innerHeight * 0.84232);
                if (Math.floor(vHeight / 64) < d.data.length) {
                    var data = d.data.slice(0, Math.floor(vHeight / 64));
                } else {
                    var data = d.data;
                }
                setEvents(
                    data.map(function (v) {
                        return (
                            <Event
                                event={v}
                                vHeight={vHeight}
                                dLength={data.length}
                            />
                        );
                    })
                );
            });
        });
    }
    useEffect(function () {
        updateWebSocket.addEventListener("calendar.events", update_calendar);
        return () =>
            updateWebSocket.removeEventListener(
                "calendar.events",
                update_calendar
            );
    });
    useLayoutEffect(function () {
        update_calendar();
        var listener = window.addEventListener("resize", update_calendar);
    }, []);
    return (
        <div className="panel calendar shadow" style={{gridArea: "calendar"}}>
            <PanelHeader title="Upcoming Events" />
            <div className="event-list">{events}</div>
        </div>
    );
}

export default PanelCalendar;
