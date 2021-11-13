import React from "react";
import "../App.scss";
import { useEffect, useState, useLayoutEffect } from "react";

var themeOverride = null;
var lastTheme = null;

function getCurrentTheme() {
    if (themeOverride) { return themeOverride; } else {
        var date = new Date(Date.now());
        if (date.getHours() >= 23 || date.getHours() < 7) {
            return 'base_dark'; // Set dark mode @ night
        } else {
            return 'base_dark'
        }
    }
}

export function PanelLogo() {
    const [theme, setTheme] = useState('base_dark');

    useEffect(function () {
        var themeUpdateInterval = setInterval(function () {
            var currentTheme = getCurrentTheme();

            if (currentTheme != lastTheme) {
                lastTheme = currentTheme;
                setTheme(currentTheme);
                fetch('/themes/'+theme+'/style.json').then(function (r) { r.json().then(function (j) {
                    document.body.setAttribute('style', Object.entries(j).map(([k, v]) => `--${k}:${v}`).join(';'));
                })});
            }
        }, 1000);
        return () => clearInterval(themeUpdateInterval);
    }, []);

    return (
        <div className="logo" style={{ gridArea: "logo", overflow: 'hidden' }}>
            
        </div>
    );
}

export default PanelLogo;