import { useEffect } from "react";
import "./App.scss";
import "./weather-icons.min.css";
import PanelInfo from "./components/info.js";
import PanelDataDog from "./components/datadog.js";
import PanelCalendar from "./components/calendar.js";
import PanelAnnouncements from "./components/announcements";
import PanelLogo from "./components/logo";
import { updateWebSocket } from "./util";

function App() {
  useEffect(function () {
    return () => updateWebSocket.close();
  });
  return (
    <div className="app-root">
      <PanelLogo />
      <PanelInfo />
      <div className="panel ticker shadow" style={{ gridArea: "ticker" }}>
        {" "}
      </div>
      <PanelAnnouncements />
      <PanelCalendar />
      <PanelDataDog />
      <div className="panel food shadow" style={{ gridArea: "food" }}>
        {" "}
      </div>
    </div>
  );
}

export default App;
