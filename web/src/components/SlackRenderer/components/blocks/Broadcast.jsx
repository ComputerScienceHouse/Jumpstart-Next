import {Mention} from "./Mention.jsx";

export function Broadcast({style, range}) {
  return (
    <Mention style={style} prefix="@" highlight={true}>
      {range}
    </Mention>
  );
}
