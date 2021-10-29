import React from "react";
import {useEffect, useState, useLayoutEffect} from "react";
import "../App.scss";
import {updateWebSocket, datetimeExpanded} from "../util";
import {PanelHeader} from "./componentUtil.js";

function Event(props) {
    // event, vHeight, dLength
    const event = props.event;
    const edt = datetimeExpanded(new Date(event.start.timestamp * 1000));
    return (
        <div
            className="event shadow"
            id={event.id}
            style={{
                height:
                    64 +
                    (Math.floor(props.vHeight / props.dLength) - 64) -
                    5 +
                    "px",
            }}
        >
            <span className="title">{event.summary}</span>
            <span className="time">
                {event.ongoing
                    ? " --- "
                    : event.startsIn.days > 0
                    ? event.startsIn.days +
                      " day" +
                      (event.startsIn.days > 1 ? "s" : "") +
                      " (" +
                      edt.date +
                      ")"
                    : event.startsIn.hours > 0
                    ? event.startsIn.hours +
                      " hour" +
                      (event.startsIn.hours > 1 ? "s" : "") +
                      " (" +
                      edt.time +
                      ")"
                    : event.startsIn.minutes > 0
                    ? event.startsIn.minutes +
                      " minute" +
                      (event.startsIn.minutes > 1 ? "s" : "") +
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

    async function updateCalendar() {
        const {data} = await fetch("/api/components/calendar/events").then(
            (res) => res.json()
        );
        // Thar be magic numbers
        const vHeight = Math.floor(window.innerHeight * 0.84232);
        const clippedData =
            Math.floor(vHeight / 64) < data.length
                ? data.slice(0, Math.floor(vHeight / 64))
                : data;
        setEvents(
            clippedData.map(function (event) {
                return (
                    <Event
                        event={event}
                        vHeight={vHeight}
                        dLength={data.length}
                        key={event.id}
                    />
                );
            })
        );
    }
    useEffect(function () {
        updateWebSocket.addEventListener("calendar.events", updateCalendar);
        return () =>
            updateWebSocket.removeEventListener(
                "calendar.events",
                updateCalendar
            );
    });
    useLayoutEffect(function () {
        updateCalendar();
        window.addEventListener("resize", updateCalendar);
        return () => window.removeEventListener("resize", updateCalendar);
    }, []);
    return (
        <div className="panel calendar shadow" style={{gridArea: "calendar"}}>
            <PanelHeader title="Upcoming Events" />
            <div className="event-list">{events}</div>
        </div>
    );
}

export default PanelCalendar;
