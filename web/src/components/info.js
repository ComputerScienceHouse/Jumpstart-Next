import React from 'react';
import { useEffect, useState, useLayoutEffect } from 'react';
import '../App.scss';
import { updateWebSocket, timestr, datetimeExpanded } from '../util';

function PanelInfo (props) {

    const [weather, setWeather] = useState({});
    const [time, setTime] = useState("00:00:00");
    const [date, setDate] = useState("Sunday 01/01/2000");

    function updateWeather() {
        fetch('/api/components/info/weather').then(function (r) {r.json().then(function (d) {
            setWeather(d.data);
            console.log(d.data);
        })});
    }
    function wsListener(e) {
        console.log(e);
        updateWeather();
    }
    useEffect(function () {
        updateWebSocket.addEventListener('info.weather', wsListener);
        return () => updateWebSocket.removeEventListener('info.weather', wsListener);
    });
    useEffect(function () {
        updateWeather();
    }, []);
    useLayoutEffect(function () {
        var time_int = setInterval(function () {
            var dt = datetimeExpanded(new Date(Date.now()));
            setTime(dt.time);
            setDate(dt.date);
        }, 200);
        return () => clearInterval(time_int);
    }, []);
    return (
        <div className="panel info" style={{gridArea: "info"}}>
            <div className="logo-time">
                <img src="logo.svg" alt="CSH Logo" className="logo"></img>
                <svg viewBox="0 0 56 10" className="datetime">
                    <text x="50%" y="6" fontSize="8" textAnchor="middle" fill="white">{time}</text>
                    <text x="50%" y="9.2" fontSize="2" textAnchor="middle" fill="white">{date}</text>
                </svg>
            </div>
        </div>
    )
}

export default PanelInfo;