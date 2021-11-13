import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import "../App.scss";
import { updateWebSocket, datetimeExpanded, UpperCamelCase } from "../util";

function getWeatherIcon(id, sunrise, sunset, override) {
    if (!override && (Date.now() < sunrise * 1000 || Date.now() > sunset * 1000)) {
        var time = 'night';
    } else {
        var time = 'day';
    }
    var type = {
        200: time + "-storm-showers",
        201: time + "-thunderstorm",
        202: "thunderstorm",
        210: time + "-lightning",
        211: "thunderstorm",
        212: "thunderstorm",
        221: time + "-sleet-storm",
        230: time + "-snow-thunderstorm",
        231: time + "-storm-showers",
        232: time + "-sleet-storm",
        300: time + "-showers",
        301: time + "-sleet",
        302: time + "-rain",
        310: time + "-showers",
        311: time + "-sleet",
        312: time + "-rain",
        313: time + "-rain",
        314: time + "-rain",
        321: time + "-showers",
        500: "showers",
        501: "sleet",
        502: "rain-mix",
        503: "rain",
        504: "rain-wind",
        511: "sleet",
        520: "sprinkle",
        521: "showers",
        522: "rain-mix",
        531: "rain-mix",
        600: time + "-snow",
        601: "snow",
        602: "snow-wind",
        611: "sleet",
        612: time + "-sleet",
        613: "sleet",
        615: time + "-rain-mix",
        616: "rain-mix",
        620: time + "-snow",
        621: "snow",
        622: "snow-wind",
        701: time + "-fog",
        711: "smog",
        721: "dust",
        731: "dust",
        741: "fog",
        751: "sandstorm",
        761: "dust",
        762: "dust",
        771: "strong-wind",
        781: "tornado",
        800: time + "-" + (time === "day" ? "sunny" : "clear"),
        801: time + "-" + (time === "day" ? "sunny" : "clear"),
        802: time + "-cloudy",
        803: "cloud",
        804: "cloudy",
    };
    return "wi wi-" + type[id];
}

function WeatherForecast(props) { // dayObj
    var p = props.dayObj;
    return <svg className="forecast shadow" viewBox="0 0 5 10">
        <text
            x="50%"
            y="1.5"
            fontSize="1.2"
            textAnchor="middle"
            fill="white"
        >
            {(p.month > 9 ? p.month : '0' + p.month)+'/'+(p.day > 9 ? p.day : '0' + p.day)}
        </text>
        <foreignObject x="0" y="2" width="5" height="5" fontSize="3">
            <i className={p.className}></i>
        </foreignObject>
        <text
            x="50%"
            y="7.8"
            fontSize="1"
            textAnchor="middle"
            fill="white"
        >
            {'HI: '+p.high}
        </text>
        <text
            x="50%"
            y="9.1"
            fontSize="1"
            textAnchor="middle"
            fill="white"
        >
            {'LO: '+p.low}
        </text>
    </svg>;
}

function PanelInfo(props) {
    const [time, setTime] = useState("00:00:00");
    const [date, setDate] = useState("Sunday 01/01/2000");
    const [logo, setLogo] = useState("logo.svg");
    const [weatherDataSet, setWeatherDataSet] = useState({
        className: "",
        units: "",
        current: {
            temp: 0,
            feelsLike: 0,
            desc: ''
        },
        daily: [
            {
                className: '',
                high: 0,
                low: 0,
                month: 0,
                day: 0
            },
            {
                className: '',
                high: 0,
                low: 0,
                month: 0,
                day: 0
            },
            {
                className: '',
                high: 0,
                low: 0,
                month: 0,
                day: 0
            }
        ]
    });

    function updateWeather() {
        fetch("/api/components/info/weather").then(function (r) {
            r.json().then(function (d) {
                if (!d.data.current) {
                    console.log('No weather data returned; API failure likely.');
                    return;
                }
                console.log(d.data);
                setWeatherDataSet({
                    className: getWeatherIcon(
                        d.data.current.weather[0].id,
                        d.data.sunrise,
                        d.data.sunset
                    ),
                    units: {imperial: "°F", metric: "°C", standard: " K"}[d.data.units],
                    current: {
                        temp: Math.floor(d.data.current.temp),
                        feelsLike: Math.floor(d.data.current.feels_like),
                        desc: UpperCamelCase(d.data.current.weather[0].description)
                    },
                    daily: [
                        {
                            className: getWeatherIcon(d.data.daily[1].weather[0].id, 0, 0, true),
                            high: Math.floor(d.data.daily[1].temp.max)+{imperial: "°F", metric: "°C", standard: " K"}[d.data.units],
                            low: Math.floor(d.data.daily[1].temp.min)+{imperial: "°F", metric: "°C", standard: " K"}[d.data.units],
                            month: (new Date(d.data.daily[1].dt * 1000)).getMonth() + 1,
                            day: (new Date(d.data.daily[1].dt * 1000)).getDate()
                        },
                        {
                            className: getWeatherIcon(d.data.daily[2].weather[0].id, 0, 0, true),
                            high: Math.floor(d.data.daily[2].temp.max)+{imperial: "°F", metric: "°C", standard: " K"}[d.data.units],
                            low: Math.floor(d.data.daily[2].temp.min)+{imperial: "°F", metric: "°C", standard: " K"}[d.data.units],
                            month: (new Date(d.data.daily[2].dt * 1000)).getMonth() + 1,
                            day: (new Date(d.data.daily[2].dt * 1000)).getDate()
                        },
                        {
                            className: getWeatherIcon(d.data.daily[3].weather[0].id, 0, 0, true),
                            high: Math.floor(d.data.daily[3].temp.max)+{imperial: "°F", metric: "°C", standard: " K"}[d.data.units],
                            low: Math.floor(d.data.daily[3].temp.min)+{imperial: "°F", metric: "°C", standard: " K"}[d.data.units],
                            month: (new Date(d.data.daily[3].dt * 1000)).getMonth() + 1,
                            day: (new Date(d.data.daily[3].dt * 1000)).getDate()
                        }
                    ]
                });
            });
        });
    }
    function wsListener(e) {
        console.log(e);
        updateWeather();
    }
    useEffect(function () {
        updateWebSocket.addEventListener("info.weather", wsListener);
        return () =>
            updateWebSocket.removeEventListener("info.weather", wsListener);
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
        var logo_int = setInterval(function () {
            if (Math.random() > 0.95) {
                setLogo("logo2.svg");
                setTimeout(() => setLogo("logo.svg"), 15000);
            }
        }, 900000);
        return function () {
            clearInterval(time_int);
            clearInterval(logo_int);
        };
    }, []);
    return (
        <div className="panel info shadow" style={{ gridArea: "info" }}>
            <div className="logo-time">
                <svg viewBox="0 0 56 10" className="datetime">
                    <text
                        x="50%"
                        y="6"
                        fontSize="7"
                        textAnchor="middle"
                        fill="white"
                    >
                        {time}
                    </text>
                    <text
                        x="50%"
                        y="9"
                        fontSize="2"
                        textAnchor="middle"
                        fill="white"
                    >
                        {date}
                    </text>
                </svg>
            </div>
            <div className="weather">
                <svg viewBox="0 0 10 10" className="current shadow">
                    <foreignObject x="0" y="1" width="12" height="10" fontSize="4">
                        <i className={weatherDataSet.className}></i>
                    </foreignObject>
                    <text
                        x="90%"
                        y="4"
                        fontSize="1.75"
                        textAnchor="middle"
                        fill="white"
                    >
                        {weatherDataSet.current.temp+weatherDataSet.units}
                    </text>
                    <text
                        x="90%"
                        y="5.5"
                        fontSize="1.1"
                        textAnchor="middle"
                        fill="white"
                    >
                        [{weatherDataSet.current.feelsLike+weatherDataSet.units}]
                    </text>
                    <foreignObject x="-1" y="6" width="12" height="3.5" fontSize="1">
                        <span className="desc">{weatherDataSet.current.desc}</span>
                    </foreignObject>
                </svg>
                <div className="daily">
                    <WeatherForecast dayObj={weatherDataSet.daily[0]} />
                    <WeatherForecast dayObj={weatherDataSet.daily[1]} />
                    <WeatherForecast dayObj={weatherDataSet.daily[2]} />
                </div>
            </div>
        </div>
    );
}

export default PanelInfo;