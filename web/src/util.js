export const updateWebSocket = new WebSocket(
    "ws://" + window.location.host + "/api/ws"
);
updateWebSocket.addEventListener("message", function (e) {
    const event = new Event(JSON.parse(e.data).message);
    updateWebSocket.dispatchEvent(event);
});

export const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export function UpperCamelCase(str) {
    return str
        .split(" ")
        .map(function (v, i, a) {
            return v[0].toUpperCase() + v.slice(1);
        })
        .join(" ");
}

export function timestr(hours, minutes) {
    if (hours === 12) {
        return (
            hours.toString() +
            (minutes !== 0
                ? ":" + (minutes < 10 ? "0" : "") + minutes.toString()
                : "") +
            " PM"
        );
    }
    
    if (hours === 0) {
        return (
            "12" +
            (minutes !== 0
                ? ":" + (minutes < 10 ? "0" : "") + minutes.toString()
                : "") +
            " AM"
        );
    }

    if (hours > 12) {
        return (
            (hours - 12).toString() +
            (minutes !== 0
                ? ":" + (minutes < 10 ? "0" : "") + minutes.toString()
                : "") +
            " PM"
        );
    } else {
        return (
            hours.toString() +
            (minutes !== 0
                ? ":" + (minutes < 10 ? "0" : "") + minutes.toString()
                : "") +
            " AM"
        );
    }
}

export function datetimeExpanded(date) {
    const day =
        DAYS[date.getDay()] +
        " " +
        (date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1)) +
        "/" +
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "/" +
        date.getFullYear();
    const time =
        (date.getHours() > 12
            ? date.getHours() - 12
            : date.getHours() === 0
            ? 12
            : date.getHours()) +
        ":" +
        (date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()) +
        ":" +
        (date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()) +
        " " +
        (date.getHours() > 12
            ? date.getHours() === 24
                ? "AM"
                : "PM"
            : date.getHours() === 12
            ? "PM"
            : "AM");
    return {
        date: day,
        time,
    };
}
