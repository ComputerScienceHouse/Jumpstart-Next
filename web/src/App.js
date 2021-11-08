import { useEffect } from "react";
import "./App.scss";
import "./weather-icons.min.css";
import PanelInfo from "./components/info.js";
import PanelDataDog from "./components/datadog.js";
import PanelCalendar from "./components/calendar.js";
import { updateWebSocket } from './util';

function App() {
    useEffect(function () {
      return () => updateWebSocket.close();
    });
    return(
      <div className="app">
        <PanelInfo />
        <div className="panel ticker shadow" style={{gridArea: 'ticker'}}> </div>
        <div className="panel announcements shadow" style={{gridArea: 'announcements'}}> </div>
        <PanelCalendar />
        <PanelDataDog />
        <div className="panel food shadow" style={{gridArea: 'food'}}> </div>
      </div>
    );
}

export default App;
