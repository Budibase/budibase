import Input from "../common/Input.svelte"
import OptionSelect from "./OptionSelect.svelte"
import InputGroup from "../common/Inputs/InputGroup.svelte"
/*
  TODO: Allow for default values for all properties
*/

export const layout = [
  {
    label: "Direction",
    cssKey: "flex-direction",
    control: OptionSelect,
    initialValue: "columnReverse",
    options: [
      { label: "row" },
      { label: "row-reverse", value: "rowReverse" },
      { label: "column" },
      { label: "column-reverse", value: "columnReverse" },
    ],
  },
  { label: "Justify", cssKey: "justify-content", control: Input },
  { label: "Align", cssKey: "align-items", control: Input },
  {
    label: "Wrap",
    cssKey: "flex-wrap",
    control: OptionSelect,
    options: [{ label: "wrap" }, { label: "no wrap", value: "noWrap" }],
  },
]

const spacingMeta = [
  { placeholder: "T" },
  { placeholder: "R" },
  { placeholder: "B" },
  { placeholder: "L" },
]
export const spacing = [
  {
    label: "Padding",
    cssKey: "padding",
    control: InputGroup,
    meta: spacingMeta,
  },
  { label: "Margin", cssKey: "margin", control: InputGroup, meta: spacingMeta },
]

export const size = [
  { label: "Width", cssKey: "width", control: Input },
  { label: "Height", cssKey: "height", control: Input },
  { label: "Min W", cssKey: "min-width", control: Input },
  { label: "Min H", cssKey: "min-height", control: Input },
  { label: "Max W", cssKey: "max-width", control: Input },
  { label: "Max H", cssKey: "max-height", control: Input },
]

export const position = [
  {
    label: "Position",
    cssKey: "position",
    control: OptionSelect,
    options: [
      { label: "static" },
      { label: "relative" },
      { label: "fixed" },
      { label: "absolute" },
      { label: "sticky" },
    ],
  },
]

export const typography = [
  {
    label: "Font",
    cssKey: "font-family",
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
  {
    label: "Weight",
    cssKey: "font-weight",
    control: OptionSelect,
    options: [
      { label: "normal" },
      { label: "bold" },
      { label: "bolder" },
      { label: "lighter" },
    ],
  },
  { label: "size", cssKey: "font-size", control: Input },
  { label: "Line H", cssKey: "line-height", control: Input },
  {
    label: "Color",
    cssKey: "color",
    control: OptionSelect,
    options: [
      { label: "black" },
      { label: "red" },
      { label: "white" },
      { label: "blue" },
      { label: "green" },
    ],
  },
  {
    label: "align",
    cssKey: "text-align",
    control: OptionSelect,
    options: [
      { label: "initial" },
      { label: "left" },
      { label: "right" },
      { label: "center" },
      { label: "justify" },
    ],
  }, //custom
  { label: "transform", cssKey: "text-transform", control: Input }, //custom
  { label: "style", cssKey: "font-style", control: Input }, //custom
]

export const background = [
  {
    label: "Background",
    cssKey: "background",
    control: OptionSelect,
    options: [
      { label: "white" },
      { label: "red" },
      { label: "blue" },
      { label: "green" },
      { label: "black" },
    ],
  },
  { label: "Image", cssKey: "image", control: Input }, //custom
]

export const border = [
  { label: "Radius", cssKey: "border-radius", control: Input },
  { label: "Width", cssKey: "border-width", control: Input }, //custom
  { label: "Color", cssKey: "border-color", control: Input },
  { label: "Style", cssKey: "border-style", control: Input },
]

export const effects = [
  { label: "Opacity", cssKey: "opacity", control: Input },
  { label: "Rotate", cssKey: "transform", control: Input }, //needs special control
  { label: "Shadow", cssKey: "box-shadow", control: Input },
]

export const transitions = [
  { label: "Property", cssKey: "transition-property", control: Input },
  { label: "Duration", cssKey: "transition-timing-function", control: Input },
  { label: "Ease", cssKey: "transition-ease", control: Input },
]

export const all = {
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