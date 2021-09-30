import { useEffect } from "react";
import "./App.scss";
import "./weather-icons.min.css";
import PanelInfo from "./components/info.js";
import { updateWebSocket } from './util';

function App() {
    useEffect(function () {
      return () => updateWebSocket.close();
    });
    return <div className="app">
      <div className="panel ticker shadow" style={{gridArea: 'ticker'}}> </div>
      <PanelInfo />
      <div className="panel announcements shadow" style={{gridArea: 'announcements'}}> </div>
      <div className="panel calendar shadow" style={{gridArea: 'calendar'}}> </div>
      <div className="panel datadog shadow" style={{gridArea: 'datadog'}}> </div>
      <div className="panel food shadow" style={{gridArea: 'food'}}> </div>
    </div>;
}

export default App;
