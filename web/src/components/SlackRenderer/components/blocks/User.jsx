import {Mention} from "./Mention.jsx";
import {WrappedValue} from "../WrappedValue.jsx";
import {wrapPromise} from "../../wrapPromise.js";

export function User({style, user_id, context}) {
  return (
    <Mention style={style} prefix="@">
      <WrappedValue
        content={wrapPromise(context.getUser(user_id)).then(
          (user) => user.name
        )}
      />
    </Mention>
  );
}
