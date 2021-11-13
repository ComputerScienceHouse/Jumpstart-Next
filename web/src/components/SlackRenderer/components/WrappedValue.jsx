import "../styles/WrappedValue.scss";
import {useState, useEffect} from "react";
import {wrapPromise} from "../wrapPromise.js";

export function WrappedValue({content}) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    let running = true;
    wrapPromise(content).then((result) => {
      if (running) {
        setResult(result);
      }
    });

    return () => {
      running = false;
      setResult(null);
    };
  }, [content]);

  if (result === null) {
    return (
      <span className="pendingWrapper">
        <span className="pending" />
      </span>
    );
  } else if (result === undefined) {
    return "undefined";
  } else {
    return result;
  }
}
