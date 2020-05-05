import ColorPicker from "../common/Colorpicker.svelte"
import Input from "../common/Input.svelte"
import TempSelect from "./TempSelect.svelte"
/*
  TODO: all strings types are really inputs and could be typed as such
  TODO: Options types need option items
  TODO: Allow for default values for all properties
*/

export const general = {
  text: { control: Input }
}

export const layout = {
  flexDirection: { label: "Direction", control: "string" },
  justifyContent: { label: "Justify", control: "string" },
  alignItems: { label: "Align", control: "string" },
  flexWrap: { label: "Wrap", control: "options" },
}

export const spacing = {
  padding: { control: "string" },
  margin: { control: "string" },
}

export const size = {
  width: { control: "string" },
  height: { control: "string" },
  minWidth: { label: "Min W", control: "string" },
  minHeight: { label: "Min H", control: "string" },
  maxWidth: { label: "Max W", control: "string" },
  maxHeight: { label: "Max H", control: "string" },
  overflow: { control: "string" }, //custom
}

export const position = {
  position: { control: "options" },
}

export const typography = {
  font: { control: "options" },
  weight: { control: "options" },
  size: { control: "string" },
  lineHeight: { label: "Line H", control: "string" },
  color: { control: "colour" },
  align: { control: "string" }, //custom
  transform: { control: "string" }, //custom
  style: { control: "string" }, //custom
}

export const background = {
  backgroundColor: { label: "Background Color", control: ColorPicker },
  image: { control: Input }, //custom
}

export const border = {
  radius: { control: "string" },
  width: { control: "string" }, //custom
  color: { control: "colour" },
  style: { control: "options" },
}

export const effects = {
  opacity: "string",
  rotate: "string",
  shadow: "string",
}

export const transitions = {
  property: { control: "options" },
  duration: { control: "string" },
  ease: { control: "options" },
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
