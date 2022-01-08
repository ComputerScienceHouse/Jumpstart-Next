import "../styles/MessageHeader.scss";
import {WrappedValue} from "./WrappedValue.jsx";
import {wrapPromise} from "../wrapPromise.js";

export function MessageHeader({user, ts, context}) {
  const stringTime = new Date(Number(ts) * 1000).toLocaleString();

  return (
    <div className="messageHeader">
      <span className="user">
        <WrappedValue
          content={wrapPromise(context.getUser(user)).then(
            (user) => user.real_name
          )}
        />
      </span>
      <time
        dateTime={new Date(Number(ts) * 1000).toString()}
        className="date"
      >
        {stringTime}
      </time>
    </div>
  );
}
