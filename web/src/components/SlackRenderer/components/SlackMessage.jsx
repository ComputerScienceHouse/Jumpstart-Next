import styles from "../styles/SlackMessage.scss";
import {Avatar} from "./Avatar.jsx";
import {MessageHeader} from "./MessageHeader.jsx";
import {Blocks} from "./Blocks.jsx";

export function SlackMessage({blocks, text, user, ts, context}) {
  console.log("FUCK FUCK SHIT FUCK SHIT", styles)
  return (
    <div className="messageContainer">
      <Avatar user={user} />
      <MessageHeader user={user} ts={ts} context={context} />
      <div className="messageContent">
        <Blocks text={text} elements={blocks} context={context} />
      </div>
    </div>
  );
}
