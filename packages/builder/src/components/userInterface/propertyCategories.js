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
    initialValue: "Select Option",
    options: [
      { label: "Select Option", value: "Na" },
      { label: "Flex", value: "flex" },
      { label: "Inline Flex", value: "inline-flex" },
    ],
  },
  {
    label: "Direction",
    key: "flex-direction",
    control: OptionSelect,
    initialValue: "Select Option",
    options: [
      { label: "Select Option", value: "Na" },
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
    initialValue: "Select Option",
    options: [
      { label: "Select Option", value: "Na" },
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
    initialValue: "Select Option",
    options: [
      { label: "Select Option", value: "Na" },
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
    initialValue: "Wrap",
    options: [
      { label: "Select Option", value: "Na" },
      { label: "Wrap", value: "wrap" },
      { label: "No Wrap", value: "nowrap" },
      { label: "Wrap Reverse", value: "wrap-reverse" },
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
    key: "font-family",
    control: OptionSelect,
    defaultValue: "initial",
    options: [
      "initial",
      "Times New Roman",
      "Georgia",
      "Arial",
      "Arial Black",
      "Comic Sans MS",
      "Impact",
      "Lucida Sans Unicode",
    ],
    styleBindingProperty: "font-family",
  },
  {
    label: "Weight",
    key: "font-weight",
    control: OptionSelect,
    options: [
      { label: "normal" },
      { label: "bold" },
      { label: "bolder" },
      { label: "lighter" },
    ],
  },
  { label: "size", key: "font-size", defaultValue: "", control: Input },
  { label: "Line H", key: "line-height", control: Input },
  {
    label: "Color",
    key: "color",
    control: OptionSelect,
    options: ["black", "white", "red", "blue", "green"],
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
    control: OptionSelect,
    options: ["black", "white", "red", "blue", "green"],
  },
  { label: "Image", key: "image", control: Input }, //custom
]

export const border = [
  { label: "Radius", key: "border-radius", control: Input },
  { label: "Width", key: "border-width", control: Input }, //custom
  {
    label: "Color",
    key: "border-color",
    control: OptionSelect,
    options: ["black", "white", "red", "blue", "green"],
  },
  { label: "Style", key: "border-style", control: Input },
]

export const effects = [
  { label: "Opacity", key: "opacity", control: Input },
  { label: "Rotate", key: "transform", control: Input }, //needs special control
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
