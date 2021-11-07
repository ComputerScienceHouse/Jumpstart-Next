import {Mention} from "./Mention.jsx";
import {WrappedValue} from "../WrappedValue.jsx";
import {wrapPromise} from "../../wrapPromise.js";

export function Channel({style, channel_id, context}) {
  return (
    <Mention style={style} prefix="#">
      <WrappedValue
        content={wrapPromise(context.getChannel(channel_id)).then(
          (channel) => channel.name
        )}
      />
    </Mention>
  );
}
