import React from 'react';
import { useEffect } from 'react';
import '../App.scss';
import { updateWebSocket } from '../util';

function PanelInfo (props) {

    function wsListener(e) {
        console.log(e);
    }
    useEffect(function () {
        updateWebSocket.addEventListener('info.weather', wsListener);
        return () => updateWebSocket.removeEventListener('info.weather', wsListener);
    });
    return (
        <div className="panel info">

        </div>
    )
}

export default PanelInfo;