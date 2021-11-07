import styles from "../styles/SlackMessage.scss";
import {Avatar} from "./Avatar.jsx";
import {MessageHeader} from "./MessageHeader.jsx";
import {Blocks} from "./Blocks.jsx";

export function SlackMessage({blocks, text, user, ts, context}) {
  return (
    <div className={styles.messageContainer}>
      <Avatar user={user} />
      <MessageHeader user={user} ts={ts} context={context} />
      <div className={styles.messageContent}>
        <Blocks text={text} elements={blocks} context={context} />
      </div>
    </div>
  );
}
