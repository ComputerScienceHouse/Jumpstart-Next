import styles from "../../styles/blocks/Styling.scss";

export function getStyles(style) {
  const classNames = [];
  if (style) {
    if (style.bold) {
      classNames.push(styles.bold);
    }
    if (style.italic) {
      classNames.push(styles.italic);
    }
    if (style.strike) {
      classNames.push(styles.strike);
    }
  }
  return classNames;
}
