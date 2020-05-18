import Input from "../common/Input.svelte"
import OptionSelect from "./OptionSelect.svelte"
/*
  TODO: Allow for default values for all properties
*/

export const general = {
  text: { control: Input },
}

export const layout = {
  flexDirection: {
    label: "Direction",
    control: OptionSelect,
    initialValue: "columnReverse",
    options: [
      { label: "row" },
      { label: "row-reverse", value: "rowReverse" },
      { label: "column" },
      { label: "column-reverse", value: "columnReverse" },
    ],
  },
  justifyContent: { label: "Justify", control: Input },
  alignItems: { label: "Align", control: Input },
  flexWrap: {
    label: "Wrap",
    control: OptionSelect,
    options: [{ label: "wrap" }, { label: "no wrap", value: "noWrap" }],
  },
}

export const spacing = {
  padding: { control: Input },
  margin: { control: Input },
}

export const size = {
  width: { control: Input },
  height: { control: Input },
  minWidth: { label: "Min W", control: Input },
  minHeight: { label: "Min H", control: Input },
  maxWidth: { label: "Max W", control: Input },
  maxHeight: { label: "Max H", control: Input },
  overflow: {
    control: OptionSelect,
    options: [
      { label: "visible" },
      { label: "auto" },
      { label: "hidden" },
      { label: "auto" },
      { label: "scroll" },
    ],
  }, //custom
}

export const position = {
  position: {
    control: OptionSelect,
    options: [
      { label: "static" },
      { label: "relative" },
      { label: "fixed" },
      { label: "absolute" },
      { label: "sticky" },
    ],
  },
}

export const typography = {
  fontFamily: {
    label: "Font",
    control: OptionSelect,
    options: [
      { label: "initial" },
      { label: "Times New Roman" },
      { label: "Georgia" },
      { label: "Arial" },
      { label: "Arial Black" },
      { label: "Comic Sans MS" },
      { label: "Impact" },
      { label: "Lucida Sans Unicode" },
    ],
    styleBindingProperty: "font-family",
  },
  fontWeight: {
    label: "weight",
    control: OptionSelect,
    options: [
      { label: "normal" },
      { label: "bold" },
      { label: "bolder" },
      { label: "lighter" },
    ],
  },
  fontSize: { label: "size", control: Input },
  lineHeight: { label: "Line H", control: Input },
  color: {
    control: OptionSelect,
    options: [
      { label: "black" },
      { label: "red" },
      { label: "white" },
      { label: "blue" },
      { label: "green" },
    ],
  },
  textAlign: {
    label: "align",
    control: OptionSelect,
    options: [
      { label: "initial" },
      { label: "left" },
      { label: "right" },
      { label: "center" },
      { label: "justify" },
    ],
  }, //custom
  textTransform: { label: "transform", control: Input }, //custom
  fontStyle: { label: "style", control: Input }, //custom
}

export const background = {
  backgroundColor: {
    label: "Background Color",
    control: OptionSelect,
    options: [
      { label: "white" },
      { label: "red" },
      { label: "blue" },
      { label: "green" },
      { label: "black" },
    ],
  },
  image: { control: Input }, //custom
}

export const border = {
  borderRadius: { label: "radius", control: Input },
  borderWidth: { label: "width", control: Input }, //custom
  borderColor: { label: "color", control: Input },
  borderStyle: { label: "style", control: Input },
}

export const effects = {
  opacity: { control: Input },
  rotate: { control: Input },
  shadow: { control: Input },
}

export const transitions = {
  property: { control: Input },
  duration: { control: Input },
  ease: { control: Input },
}

export const all = {
  general,
  layout,
  spacing,
  size,
  position,
  typography,
  background,
  border,
  effects,
  transitions,
}

export function excludeProps(props, propsToExclude) {
  const modifiedProps = {}
  for (const prop in props) {
    if (!propsToExclude.includes(prop)) {
      modifiedProps[prop] = props[prop]
    }
  }
  return modifiedProps
}
