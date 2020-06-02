import Input from "../common/Input.svelte"
import OptionSelect from "./OptionSelect.svelte"
import InputGroup from "../common/Inputs/InputGroup.svelte"
import FlatButtonGroup from "./FlatButtonGroup.svelte"
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
    control: FlatButtonGroup,
    buttonProps: [
      { icon: "ri-arrow-right-line", padding: "0px 5px", value: "row" },
      { icon: "ri-arrow-left-line", padding: "0px 5px", value: "rowReverse" },
      { icon: "ri-arrow-down-line", padding: "0px 5px", value: "column" },
      {
        icon: "ri-arrow-up-line",
        padding: "0px 5px",
        value: "columnReverse",
      },
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
  { placeholder: "T" },
  { placeholder: "R" },
  { placeholder: "B" },
  { placeholder: "L" },
]

export const spacing = [
  {
    label: "Margin",
    key: "margin",
    control: InputGroup,
    meta: spacingMeta,
    suffix: "px",
    defaultValue: ["0", "0", "0", "0"],
  },
  {
    label: "Padding",
    key: "padding",
    control: InputGroup,
    meta: spacingMeta,
    suffix: "px",
    defaultValue: ["0", "0", "0", "0"],
  },
]

export const size = [
  {
    label: "Width",
    key: "width",
    control: Input,
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Height",
    key: "height",
    control: Input,
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Min W",
    key: "min-width",
    control: Input,
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Min H",
    key: "min-height",
    control: Input,
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Max W",
    key: "max-width",
    control: Input,
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Max H",
    key: "max-height",
    control: Input,
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
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
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Right",
    key: "right",
    control: Input,
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Bottom",
    key: "bottom",
    control: Input,
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Left",
    key: "left",
    control: Input,
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Z-index",
    key: "z-index",
    control: Input,
    placeholder: "num",
    width: "48px",
    textAlign: "center",
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
  {
    label: "size",
    key: "font-size",
    defaultValue: "",
    control: Input,
    placeholder: "px",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Line H",
    key: "line-height",
    control: Input,
    placeholder: "lh",
    width: "48px",
    textAlign: "center",
  },
  {
    label: "Color",
    key: "color",
    control: Input,
    placeholder: "hex",
  },
  {
    label: "align",
    key: "text-align",
    control: FlatButtonGroup,
    buttonProps: [
      { icon: "ri-align-left", padding: "0px 5px", value: "left" },
      { icon: "ri-align-center", padding: "0px 5px", value: "center" },
      { icon: "ri-align-right", padding: "0px 5px", value: "right" },
      { icon: "ri-align-justify", padding: "0px 5px", value: "justify" },
    ],
  },
  {
    label: "transform",
    key: "text-transform",
    control: FlatButtonGroup,
    buttonProps: [
      { text: "BB", padding: "0px 5px", fontWeight: 500, value: "uppercase" },
      { text: "Bb", padding: "0px 5px", fontWeight: 500, value: "capitalize" },
      { text: "bb", padding: "0px 5px", fontWeight: 500, value: "lowercase" },
      {
        text: "&times;",
        padding: "0px 5px",
        fontWeight: 500,
        value: "none",
      },
    ],
  },
  { label: "style", key: "font-style", control: Input },
]

export const background = [
  {
    label: "Background",
    key: "background",
    control: Input,
  },
  {
    label: "Image",
    key: "background-image",
    control: Input,
    placeholder: "src",
  },
]

export const border = [
  {
    label: "Radius",
    key: "border-radius",
    control: Input,
    width: "48px",
    placeholder: "px",
    textAlign: "center",
  },
  {
    label: "Width",
    key: "border-width",
    control: Input,
    width: "48px",
    placeholder: "px",
    textAlign: "center",
  }, //custom
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
  {
    label: "Opacity",
    key: "opacity",
    control: Input,
    width: "48px",
    textAlign: "center",
    placeholder: "%",
  },
  {
    label: "Rotate",
    key: "transform",
    control: Input,
    width: "48px",
    textAlign: "center",
    placeholder: "deg",
  }, //needs special control
  {
    label: "Shadow",
    key: "box-shadow",
    control: InputGroup,
    meta: [{ placeholder: "X" }, { placeholder: "Y" }, { placeholder: "B" }],
  },
]

export const transitions = [
  {
    label: "Property",
    key: "transition-property",
    control: OptionSelect,
    options: [
      "None",
      "All",
      "Background Color",
      "Color",
      "Font Size",
      "Font Weight",
      "Height",
      "Margin",
      "Opacity",
      "Padding",
      "Rotate",
      "Shadow",
      "Width",
    ],
  },
  {
    label: "Duration",
    key: "transition-timing-function",
    control: Input,
    width: "48px",
    textAlign: "center",
    placeholder: "sec",
  },
  {
    label: "Ease",
    key: "transition-ease",
    control: OptionSelect,
    options: ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
  },
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
