import {Mention} from "./Mention.jsx";
import {wrapPromise} from "../../wrapPromise.js";
import {WrappedValue} from "../WrappedValue.jsx";

export function UserGroup({style, usergroup_id, context}) {
  return (
    <Mention style={style} prefix="@">
      <WrappedValue
        content={wrapPromise(context.getGroup(usergroup_id)).then(
          (group) => group.handle
        )}
      />
    </Mention>
  );
}
