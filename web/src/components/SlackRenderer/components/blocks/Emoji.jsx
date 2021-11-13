import unicodeEmoji from "../../emoji.json";
import "../../styles/blocks/Emoji.scss";

export function Emoji({name, context}) {
  const workspaceEmoji = context.workspaceEmoji;
  const unicode = unicodeEmoji[name]?.unicode;
  const url = unicode
    ? `https://a.slack-edge.com/production-standard-emoji-assets/13.0/google-medium/${unicode}.png`
    : workspaceEmoji[name];
  if (url) {
    return (
      <span className="emojiWrapper">
        <img src={url} alt={`:${name}:`} />
      </span>
    );
  } else {
    return <span className="emojiFallback">{`:${name}:`}</span>;
  }
}
