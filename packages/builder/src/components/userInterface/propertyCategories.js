import Input from "../common/Input.svelte"
import OptionSelect from "./OptionSelect.svelte"
import FlatButtonGroup from "./FlatButtonGroup.svelte"
import Colorpicker from "./Colorpicker"
/*
  TODO: Allow for default values for all properties
*/

export const layout = [
  {
    label: "Display",
    key: "display",
    control: OptionSelect,
    initialValue: "",
    options: [
      { label: "N/A ", value: "N/A" },
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
      { label: "", value: "" },
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

export const margin = [
  {
    label: "All sides",
    key: "margin",
    control: OptionSelect,
    options: [
      { label: "None", value: "0px" },
      { label: "4px", value: "4px" },
      { label: "8px", value: "8px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "32px", value: "32px" },
      { label: "64px", value: "64px" },
      { label: "Auto", value: "auto" },
      { label: "100%", value: "100%" },
    ],
  },
  {
    label: "Top",
    key: "margin-top",
    control: OptionSelect,
    options: [
      { label: "None", value: "0px" },
      { label: "4px", value: "4px" },
      { label: "8px", value: "8px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "32px", value: "32px" },
      { label: "64px", value: "64px" },
      { label: "Auto", value: "auto" },
      { label: "100%", value: "100%" },
    ],
  },
  {
    label: "Right",
    key: "margin-right",
    control: OptionSelect,
    options: [
      { label: "None", value: "0px" },
      { label: "4px", value: "4px" },
      { label: "8px", value: "8px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "32px", value: "32px" },
      { label: "64px", value: "64px" },
      { label: "Auto", value: "auto" },
      { label: "100%", value: "100%" },
    ],
  },
  {
    label: "Bottom",
    key: "margin-bottom",
    control: OptionSelect,
    options: [
      { label: "None", value: "0px" },
      { label: "4px", value: "4px" },
      { label: "8px", value: "8px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "32px", value: "32px" },
      { label: "64px", value: "64px" },
      { label: "Auto", value: "auto" },
      { label: "100%", value: "100%" },
    ],
  },
  {
    label: "Left",
    key: "margin-left",
    control: OptionSelect,
    options: [
      { label: "None", value: "0px" },
      { label: "4px", value: "4px" },
      { label: "8px", value: "8px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "32px", value: "32px" },
      { label: "64px", value: "64px" },
      { label: "Auto", value: "auto" },
      { label: "100%", value: "100%" },
    ],
  },
]

export const padding = [
  {
    label: "All sides",
    key: "padding",
    control: OptionSelect,
    options: [
      { label: "None", value: "0px" },
      { label: "4px", value: "4px" },
      { label: "8px", value: "8px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "32px", value: "32px" },
      { label: "64px", value: "64px" },
      { label: "Auto", value: "auto" },
      { label: "100%", value: "100%" },
    ],
  },
  {
    label: "Top",
    key: "padding-top",
    control: OptionSelect,
    options: [
      { label: "None", value: "0px" },
      { label: "4px", value: "4px" },
      { label: "8px", value: "8px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "32px", value: "32px" },
      { label: "64px", value: "64px" },
      { label: "Auto", value: "auto" },
      { label: "100%", value: "100%" },
    ],
  },
  {
    label: "Right",
    key: "padding-right",
    control: OptionSelect,
    options: [
      { label: "None", value: "0px" },
      { label: "4px", value: "4px" },
      { label: "8px", value: "8px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "32px", value: "32px" },
      { label: "64px", value: "64px" },
      { label: "Auto", value: "auto" },
      { label: "100%", value: "100%" },
    ],
  },
  {
    label: "Bottom",
    key: "padding-bottom",
    control: OptionSelect,
    options: [
      { label: "None", value: "0px" },
      { label: "4px", value: "4px" },
      { label: "8px", value: "8px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "32px", value: "32px" },
      { label: "64px", value: "64px" },
      { label: "Auto", value: "auto" },
      { label: "100%", value: "100%" },
    ],
  },
  {
    label: "Left",
    key: "padding-left",
    control: OptionSelect,
    options: [
      { label: "None", value: "0px" },
      { label: "4px", value: "4px" },
      { label: "8px", value: "8px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "32px", value: "32px" },
      { label: "64px", value: "64px" },
      { label: "Auto", value: "auto" },
      { label: "100%", value: "100%" },
    ],
  },
]

export const size = [
  {
    label: "Width",
    key: "width",
    control: Input,
    placeholder: "px",
    textAlign: "center",
  },
  {
    label: "Height",
    key: "height",
    control: Input,
    placeholder: "px",
    textAlign: "center",
  },
  {
    label: "Min Width",
    key: "min-width",
    control: Input,
    placeholder: "px",
    textAlign: "center",
  },
  {
    label: "Max Width",
    key: "max-width",
    control: Input,
    placeholder: "px",
    textAlign: "center",
  },
  {
    label: "Min Height",
    key: "min-height",
    control: Input,
    placeholder: "px",
    textAlign: "center",
  },
  {
    label: "Max Height",
    key: "max-height",
    control: Input,
    placeholder: "px",
    textAlign: "center",
  },
]

export const position = [
  {
    label: "Position",
    key: "position",
    control: OptionSelect,
    initialValue: "None",
    options: [
      { label: "None", value: "none" },
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
    textAlign: "center",
  },
  {
    label: "Right",
    key: "right",
    control: Input,
    placeholder: "px",
    textAlign: "center",
  },
  {
    label: "Bottom",
    key: "bottom",
    control: Input,
    placeholder: "px",
    textAlign: "center",
  },
  {
    label: "Left",
    key: "left",
    control: Input,
    placeholder: "px",
    textAlign: "center",
  },
  {
    label: "Z-index",
    key: "z-index",
    control: OptionSelect,
    options: ["-9999", "-3", "-2", "-1", "0", "1", "2", "3", "9999"],
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
    options: ["200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    label: "size",
    key: "font-size",
    control: OptionSelect,
    options: [
      "8px",
      "10px",
      "12px",
      "14px",
      "16px",
      "18px",
      "20px",
      "24px",
      "32px",
      "48px",
      "60px",
      "72px",
    ],
    textAlign: "center",
  },
  {
    label: "Line H",
    key: "line-height",
    control: OptionSelect,
    options: ["1", "1.25", "1.5", "1.75", "2", "4"],
  },
  {
    label: "Color",
    key: "color",
    control: Colorpicker,
    defaultValue: "#000",
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
      { text: "BB", value: "uppercase" },
      { text: "Bb", value: "capitalize" },
      { text: "bb", value: "lowercase" },
      { text: "&times;", value: "none" },
    ],
  },
  {
    label: "Decoration",
    key: "text-decoration-line",
    control: OptionSelect,
    defaultValue: "None",
    options: [
      { label: "None", value: "none" },
      { label: "Underline", value: "underline" },
      { label: "Overline", value: "overline" },
      { label: "Line-through", value: "line-through" },
      { label: "Under Over", value: "underline overline" },
    ],
  },
]

export const background = [
  {
    label: "Color",
    key: "background",
    control: Colorpicker,
    defaultValue: "#000",
  },
  {
    label: "Gradient",
    key: "background-image",
    control: OptionSelect,
    defaultValue: "None",
    options: [
      { label: "None", value: "None" },
      {
        label: "Warm Flame",
        value: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);",
      },
      {
        label: "Night Fade",
        value: "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);",
      },
      {
        label: "Spring Warmth",
        value: "linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);",
      },
      {
        label: "Sunny Morning",
        value: "linear-gradient(120deg, #f6d365 0%, #fda085 100%);",
      },
      {
        label: "Winter Neva",
        value: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);",
      },
      {
        label: "Tempting Azure",
        value: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);",
      },
      {
        label: "Heavy Rain",
        value: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);",
      },
      {
        label: "Deep Blue",
        value: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);",
      },
      {
        label: "Near Moon",
        value: "linear-gradient(to top, #5ee7df 0%, #b490ca 100%);",
      },
      {
        label: "Wild Apple",
        value: "linear-gradient(to top, #d299c2 0%, #fef9d7 100%);",
      },
      {
        label: "Plum Plate",
        value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%);",
      },
    ],
  },
  {
    label: "Image",
    key: "background-image",
    control: Input,
    placeholder: "Src",
  },
]

export const border = [
  {
    label: "Radius",
    key: "border-radius",
    control: OptionSelect,
    defaultValue: "None",
    options: [
      { label: "None", value: "0" },
      { label: "X Small", value: "0.125rem" },
      { label: "Small", value: "0.25rem" },
      { label: "Medium", value: "0.5rem" },
      { label: "Large", value: "1rem" },
      { label: "X Large", value: "2rem" },
      { label: "XX Large", value: "4rem" },
      { label: "Round", value: "5678px" },
    ],
  },
  {
    label: "Width",
    key: "border-width",
    control: OptionSelect,
    defaultValue: "None",
    options: [
      { label: "None", value: "0" },
      { label: "X Small", value: "0.5px" },
      { label: "Small", value: "1px" },
      { label: "Medium", value: "2px" },
      { label: "Large", value: "4px" },
      { label: "X large", value: "8px" },
    ],
  },
  {
    label: "Color",
    key: "border-color",
    control: Colorpicker,
    defaultValue: "#000",
  },
  {
    label: "Style",
    key: "border-style",
    control: OptionSelect,
    defaultValue: "None",
    options: [
      "None",
      "Hidden",
      "Dotted",
      "Dashed",
      "Solid",
      "Double",
      "Groove",
      "Ridge",
      "Inset",
      "Outset",
    ],
  },
]

export const effects = [
  {
    label: "Opacity",
    key: "opacity",
    control: OptionSelect,
    textAlign: "center",
    options: ["0", "0.2", "0.4", "0.6", "0.8", "1"],
  },
  {
    label: "Rotate",
    key: "transform",
    control: OptionSelect,
    defaultValue: "0",
    options: [
      { label: "None", value: "0" },
      { label: "45 deg", value: "rotate(45deg)" },
      { label: "90 deg", value: "rotate(90deg)" },
      { label: "135 deg", value: "rotate(135deg)" },
      { label: "180 deg", value: "rotate(180deg)" },
      { label: "225 deg", value: "rotate(225deg)" },
      { label: "270 deg", value: "rotate(270deg)" },
      { label: "315 deg", value: "rotate(315deg)" },
      { label: "360 deg", value: "rotate(360deg)" },
    ],
  },
  {
    label: "Shadow",
    key: "box-shadow",
    control: OptionSelect,
    defaultValue: "None",
    options: [
      { label: "None", value: "none" },
      { label: "X Small", value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
      {
        label: "Small",
        value:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
      {
        label: "Medium",
        value:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      {
        label: "Large",
        value:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      {
        label: "X Large",
        value:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
    ],
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
    key: "transition-duration",
    control: OptionSelect,
    textAlign: "center",
    placeholder: "sec",
    options: ["0.2ms", "0.4ms", "0.8ms", "1s", "2s", "4s"],
  },
  {
    label: "Ease",
    key: "transition-timing-function:",
    control: OptionSelect,
    options: ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
  },
]

export const all = {
  layout,
  margin,
  padding,
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
