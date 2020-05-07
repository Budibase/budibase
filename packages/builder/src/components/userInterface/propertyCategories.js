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
  overflow: { control: Input }, //custom
}

export const position = {
  position: { control: Input },
}

export const typography = {
  font: { control: Input },
  weight: { control: Input },
  size: { control: Input },
  lineHeight: { label: "Line H", control: Input },
  color: {
    control: OptionSelect,
    options: [{ label: "red" }, { label: "blue" }, { label: "green" }],
  },
  align: { control: Input }, //custom
  transform: { control: Input }, //custom
  style: { control: Input }, //custom
}

export const background = {
  backgroundColor: { label: "Background Color", control: Input },
  image: { control: Input }, //custom
}

export const border = {
  radius: { control: Input },
  width: { control: Input }, //custom
  color: { control: Input },
  style: { control: Input },
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
