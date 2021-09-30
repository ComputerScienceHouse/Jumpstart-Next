import { useEffect } from "react";
import "./App.scss";
import PanelInfo from "./components/info.js";
import { updateWebSocket } from './util';

function App() {
    useEffect(function () {
      return () => updateWebSocket.close();
    });
    return <div className="app">
      <PanelInfo />
      <div className="panel announcements shadow" style={{gridArea: 'announcements'}}> </div>
      <div className="panel calendar shadow" style={{gridArea: 'calendar'}}> </div>
      <div className="panel datadog shadow" style={{gridArea: 'datadog'}}> </div>
      <div className="panel ticker shadow" style={{gridArea: 'ticker'}}> </div>
    </div>;
}

export default App;
