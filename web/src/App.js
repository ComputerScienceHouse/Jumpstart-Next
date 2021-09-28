import { useEffect } from "react";
import "./App.scss";
import PanelInfo from "./components/info.js";
import { updateWebSocket } from './util';

function App() {
    useEffect(function () {
      return () => updateWebSocket.close();
    });
    return <div className="App">
      <PanelInfo content="test" />
    </div>;
}

export default App;
