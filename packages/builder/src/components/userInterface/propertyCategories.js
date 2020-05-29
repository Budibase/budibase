import Input from "../common/Input.svelte"
import OptionSelect from "./OptionSelect.svelte"
import InputGroup from "../common/Inputs/InputGroup.svelte"
// import Colorpicker from "../common/Colorpicker.svelte"
/*
  TODO: Allow for default values for all properties
*/

export const layout = [
  {
    label: "Display",
    key: "display",
    control: OptionSelect,
    initialValue: "Flex",
    options: [
      { label: "Flex", value: "flex" },
      { label: "Inline Flex", value: "inline-flex" },
    ],
  },
  {
    label: "Direction",
    key: "flex-direction",
    control: OptionSelect,
    initialValue: "Row",
    options: [
      { label: "Row", value: "row" },
      { label: "Row Reverse", value: "rowReverse" },
      { label: "column", value: "column" },
      { label: "Column Reverse", value: "columnReverse" },
    ],
  },
  {
    label: "Justify",
    key: "justify-content",
    control: OptionSelect,
    initialValue: "Flex Start",
    options: [
      { label: "Flex Start", value: "flex-start" },
      { label: "Flex End", value: "flex-end" },
      { label: "Center", value: "center" },
      { label: "Space Between", value: "space-between" },
      { label: "Space Around", value: "space-around" },
      { label: "Space Evenly", value: "space-evenly" },
    ],
  },
  {
    label: "Align",
    key: "align-items",
    control: OptionSelect,
    initialValue: "Flex Start",
    options: [
      { label: "Flex Start", value: "flex-start" },
      { label: "Flex End", value: "flex-end" },
      { label: "Center", value: "center" },
      { label: "Baseline", value: "baseline" },
      { label: "Stretch", value: "stretch" },
    ],
  },
  {
    label: "Wrap",
    key: "flex-wrap",
    control: OptionSelect,
    options: [
      { label: "wrap", value: "wrap" },
      { label: "no wrap", value: "noWrap" },
    ],
  },
]

const spacingMeta = [
  { placeholder: "L" },
  { placeholder: "B" },
  { placeholder: "R" },
  { placeholder: "T" },
]

export const spacing = [
  { label: "Margin", key: "margin", control: InputGroup, meta: spacingMeta },
  {
    label: "Padding",
    key: "padding",
    control: InputGroup,
    meta: spacingMeta,
  },
]

export const size = [
  { label: "Width", key: "width", control: Input },
  { label: "Height", key: "height", control: Input },
  { label: "Min W", key: "min-width", control: Input },
  { label: "Min H", key: "min-height", control: Input },
  { label: "Max W", key: "max-width", control: Input },
  { label: "Max H", key: "max-height", control: Input },
]

export const position = [
  {
    label: "Position",
    key: "position",
    control: OptionSelect,
    initialValue: "Wrap",
    options: [
      { label: "Static", value: "static" },
      { label: "Relative", value: "relative" },
      { label: "Fixed", value: "fixed" },
      { label: "Absolute", value: "absolute" },
      { label: "Sticky", value: "sticky" },
    ],
  },
  {
    label: "Top",
    key: "top",
    control: Input,
  },
  {
    label: "Right",
    key: "right",
    control: Input,
  },
  {
    label: "Bottom",
    key: "bottom",
    control: Input,
  },
  {
    label: "Left",
    key: "left",
    control: Input,
  },
  {
    label: "Z-index",
    key: "z-index",
    control: Input,
  },
]

export const typography = [
  {
    label: "Font",
    key: "font-family",
    control: OptionSelect,
    defaultValue: "initial",
    options: [
      "initial",
      "Arial",
      "Arial Black",
      "Cursive",
      "Courier",
      "Comic Sans MS",
      "Helvetica",
      "Impact",
      "Inter",
      "Lucida Sans Unicode",
      "Open Sans",
      "Playfair",
      "Roboto",
      "Roboto Mono",
      "Times New Roman",
      "Verdana",
    ],
    styleBindingProperty: "font-family",
  },
  {
    label: "Weight",
    key: "font-weight",
    control: OptionSelect,
    options: ["normal", "bold", "bolder", "lighter"],
  },
  { label: "size", key: "font-size", defaultValue: "", control: Input },
  { label: "Line H", key: "line-height", control: Input },
  {
    label: "Color",
    key: "color",
    control: Input,
  },
  {
    label: "align",
    key: "text-align",
    control: OptionSelect,
    options: ["initial", "left", "right", "center", "justify"],
  }, //custom
  { label: "transform", key: "text-transform", control: Input }, //custom
  { label: "style", key: "font-style", control: Input }, //custom
]

export const background = [
  {
    label: "Background",
    key: "background",
    control: Input,
  },
  { label: "Image", key: "image", control: Input }, //custom
]

export const border = [
  { label: "Radius", key: "border-radius", control: Input },
  { label: "Width", key: "border-width", control: Input }, //custom
  {
    label: "Color",
    key: "border-color",
    control: Input,
  },
  {
    label: "Style",
    key: "border-style",
    control: OptionSelect,
    options: [
      "none",
      "hidden",
      "dotted",
      "dashed",
      "solid",
      "double",
      "groove",
      "ridge",
      "inset",
      "outset",
    ],
  },
]

export const effects = [
  { label: "Opacity", key: "opacity", control: Input },
  {
    label: "Rotate",
    key: "transform",
    control: OptionSelect,
    options: [
      { label: "None", value: "rotate(0deg)" },
      { label: "45 degrees", value: "rotate(45deg)" },
      { label: "90 degrees", value: "rotate(90deg)" },
      { label: "135 degrees", value: "rotate(135deg)" },
      { label: "180 degrees", value: "rotate(180deg)" },
      { label: "225 degrees", value: "rotate(225deg)" },
      { label: "270 degrees", value: "rotate(270deg)" },
      { label: "315 degrees", value: "rotate(315deg)" },
      { label: "360 degrees", value: "rotate(360deg)" },
    ],
  }, //needs special control
  { label: "Shadow", key: "box-shadow", control: Input },
]

export const transitions = [
  { label: "Property", key: "transition-property", control: Input },
  { label: "Duration", key: "transition-timing-function", control: Input },
  { label: "Ease", key: "transition-ease", control: Input },
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
