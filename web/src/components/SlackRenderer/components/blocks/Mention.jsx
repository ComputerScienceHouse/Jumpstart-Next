import styles from "../../styles/blocks/Mention.scss";
import {getStyles} from "./Styling.jsx";

export function Mention({style, children, prefix, highlight}) {
  const classes = getStyles(style);
  classes.push(styles.mention);
  // The user would be notified by this (e.g. at-channel)
  if (highlight) {
    classes.push('highlight');
  }
  return (
    <span className={classes.join(" ")}>
      {prefix}
      {children}
    </span>
  );
}
