import React from "react";
import "../App.scss";
import { useEffect, useState } from "react";

function getCurrentTheme() {
  var date = new Date(Date.now());
  if (date.getHours() >= 23 || date.getHours() < 7) {
    return "base_dark"; // Set dark mode @ night
  } else {
    return "base_light";
  }
}

export function PanelLogo() {
  const [updateRandom, setUpdateRandom] = useState(0);
  function themeInterval() {
    fetch("/api/themes/style?r=" + Math.random(), {
      cache: "no-store",
    }).then(function (r) {
      r.json().then(function (j) {
        document.body.setAttribute(
          "style",
          Object.entries(j)
            .map(([k, v]) => `--${k}:${v}`)
            .join(";")
        );
        setUpdateRandom(Math.random());
      });
    });
  }

  useEffect(function () {
    var themeUpdateInterval = setInterval(themeInterval, 2000);
    themeInterval();
    return () => clearInterval(themeUpdateInterval);
  }, []);

  return (
    <div className="logo" style={{ gridArea: "logo", overflow: "hidden" }}>
      <img
        src={"/api/themes/logo?r=" + updateRandom}
        alt="CSH Logo"
        className="logo-img"
      />
    </div>
  );
}

export default PanelLogo;
