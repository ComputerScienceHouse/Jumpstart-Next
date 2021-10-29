import React from "react";
import "../App.scss";
import {PanelHeader} from "./componentUtil.js";

export function PanelDataDog() {
    return (
        <div
            className="panel datadog shadow"
            style={{gridArea: "datadog", overflow: "hidden"}}
        >
            <PanelHeader title="DataDog - Server Management" />
            <svg
                className="frame"
                viewBox="0 0 1080 810"
                style={{
                    height: "100%",
                    overflow: "hidden",
                    width: "calc(100% + 30px)",
                }}
            >
                <foreignObject x="0" y="0" width="1080" height="1000">
                    <iframe
                        src="https://p.datadoghq.com/sb/44f16805b-cab847d58c"
                        style={{
                            width: "100%",
                            height: "calc(100% + 100px)",
                            border: "none",
                            marginTop: "-90px",
                            overflow: "hidden",
                            padding: 0,
                        }}
                        id="DataDogFrame"
                        title="Datadog"
                    ></iframe>
                </foreignObject>
            </svg>
        </div>
    );
}

export default PanelDataDog;
