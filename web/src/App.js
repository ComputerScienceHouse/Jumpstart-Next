import { useEffect } from "react";
import "./App.scss";
import "./weather-icons.min.css";
import PanelInfo from "./components/info.js";
import FoodInfo from "./components/food.js";
import PanelDataDog from "./components/datadog.js";
import PanelCalendar from "./components/calendar.js";
import PanelAnnouncements from "./components/announcements";
import PanelLogo from "./components/logo";
import BinaryBackground from "./components/binary";
import { updateWebSocket } from "./util";


function App() {
    useEffect(function () {
        return () => updateWebSocket.close();
    });

    return (
        <div className="app-root">
            <PanelLogo />
            <PanelInfo />
            <PanelAnnouncements />
            <PanelCalendar />
            <PanelDataDog />
            <FoodInfo />
            <BinaryBackground />
        </div>
    );
}

export default App;
