import "../../styles/blocks/Styling.scss";

export function getStyles(style) {
  const classNames = [];
  if (style) {
    if (style.bold) {
      classNames.push("bold");
    }
    if (style.italic) {
      classNames.push("italic");
    }
    if (style.strike) {
      classNames.push("strike");
    }
  }
  return classNames;
}
