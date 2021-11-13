import "../../styles/blocks/Text.scss";
import {getStyles} from "./Styling.jsx";

export function Text({style, text}) {
  const classNames = getStyles(style);
  classNames.push("text");

  return <span className={classNames.join(" ")}>{text}</span>;
}
