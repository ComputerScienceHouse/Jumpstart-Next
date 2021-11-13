import styles from "../../styles/blocks/Link.scss";
import {getStyles} from "./Styling.jsx";

export function Link({url, text, style}) {
  const classes = getStyles(style);
  classes.push(styles.link);
  return (
    <a className={classes.join(" ")} href={url}>
      {text || url}
    </a>
  );
}
