import {Text} from "./blocks/Text.jsx";
import {Emoji} from "./blocks/Emoji.jsx";
import {Link} from "./blocks/Link.jsx";
import {User} from "./blocks/User.jsx";
import {UserGroup} from "./blocks/UserGroup.jsx";
import {Channel} from "./blocks/Channel.jsx";
import {Broadcast} from "./blocks/Broadcast.jsx";

const BLOCKS = {
  rich_text_section: Blocks,
  rich_text: Blocks,
  text: Text,
  emoji: Emoji,
  link: Link,
  user: User,
  usergroup: UserGroup,
  channel: Channel,
  broadcast: Broadcast,
};

export function Blocks({elements, context}) {
  return elements.map((block, index) => {
    const BlockComponent = BLOCKS[block.type];
    if (!BlockComponent) {
      console.warn(
        `SlackMessage missing component of type ${block.type}!`,
        BLOCKS
      );
      return null;
    }
    return (
      <BlockComponent
        {...block}
        // Some blocks have IDs already, but otherwise we fallback to index!
        key={block.block_id || index}
        id={block.block_id}
        context={context}
      ></BlockComponent>
    );
  });
}
