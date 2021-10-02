import React from "react";
import "../App.scss";

export function PanelHeader(props) {
    return (
        <div class="header shadow">
            <span>{props.title}</span>
        </div>
    );
}

export default PanelHeader;
