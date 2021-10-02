import React from "react";
import "../App.scss";
import { PanelHeader } from "./componentUtil.js";

export function PanelDataDog() {
    return (
        <div className="panel datadog shadow" style={{ gridArea: "datadog" }}>
            <PanelHeader title="DataDog - Server Management" />
            <svg className="frame" viewBox="0 0 1080 810">
                <foreignObject x="0" y="0" width="1080" height="1000">
                    <iframe
                        src="https://p.datadoghq.com/sb/44f16805b-cab847d58c"
                        style={{
                            width: "100%",
                            height: "calc(100% - 32px + 175px)",
                            border: "none",
                            marginTop: "-90px",
                            overflow: 'hidden',
                            padding: 0
                        }}
                        id="DataDogFrame"
                    ></iframe>
                </foreignObject>
            </svg>
        </div>
    );
}

export default PanelDataDog;
