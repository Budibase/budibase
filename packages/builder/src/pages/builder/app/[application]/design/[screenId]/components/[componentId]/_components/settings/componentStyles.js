import { Input, Select } from "@budibase/bbui"
import ColorPicker from "components/design/settings/controls/ColorPicker.svelte"

export const margin = {
  label: "Margin",
  settings: [
    {
      label: "Top",
      key: "margin-top",
      control: Select,
      placeholder: "None",
      options: [
        { label: "4px", value: "4px" },
        { label: "8px", value: "8px" },
        { label: "12px", value: "12px" },
        { label: "16px", value: "16px" },
        { label: "20px", value: "20px" },
        { label: "32px", value: "32px" },
        { label: "48px", value: "48px" },
        { label: "64px", value: "64px" },
        { label: "128px", value: "128px" },
        { label: "256px", value: "256px" },
        { label: "Auto", value: "auto" },
        { label: "100%", value: "100%" },
      ],
    },
    {
      label: "Right",
      key: "margin-right",
      control: Select,
      placeholder: "None",
      options: [
        { label: "4px", value: "4px" },
        { label: "8px", value: "8px" },
        { label: "12px", value: "12px" },
        { label: "16px", value: "16px" },
        { label: "20px", value: "20px" },
        { label: "32px", value: "32px" },
        { label: "48px", value: "48px" },
        { label: "64px", value: "64px" },
        { label: "128px", value: "128px" },
        { label: "256px", value: "256px" },
        { label: "Auto", value: "auto" },
        { label: "100%", value: "100%" },
      ],
    },
    {
      label: "Bottom",
      key: "margin-bottom",
      control: Select,
      placeholder: "None",
      options: [
        { label: "4px", value: "4px" },
        { label: "8px", value: "8px" },
        { label: "12px", value: "12px" },
        { label: "16px", value: "16px" },
        { label: "20px", value: "20px" },
        { label: "32px", value: "32px" },
        { label: "48px", value: "48px" },
        { label: "64px", value: "64px" },
        { label: "128px", value: "128px" },
        { label: "256px", value: "256px" },
        { label: "Auto", value: "auto" },
        { label: "100%", value: "100%" },
      ],
    },
    {
      label: "Left",
      key: "margin-left",
      control: Select,
      placeholder: "None",
      options: [
        { label: "4px", value: "4px" },
        { label: "8px", value: "8px" },
        { label: "12px", value: "12px" },
        { label: "16px", value: "16px" },
        { label: "20px", value: "20px" },
        { label: "32px", value: "32px" },
        { label: "48px", value: "48px" },
        { label: "64px", value: "64px" },
        { label: "128px", value: "128px" },
        { label: "256px", value: "256px" },
        { label: "Auto", value: "auto" },
        { label: "100%", value: "100%" },
      ],
    },
  ],
}

export const padding = {
  label: "Padding",
  settings: [
    {
      label: "Top",
      key: "padding-top",
      control: Select,
      placeholder: "None",
      options: [
        { label: "4px", value: "4px" },
        { label: "8px", value: "8px" },
        { label: "12px", value: "12px" },
        { label: "16px", value: "16px" },
        { label: "20px", value: "20px" },
        { label: "32px", value: "32px" },
        { label: "48px", value: "48px" },
        { label: "64px", value: "64px" },
        { label: "128px", value: "128px" },
        { label: "256px", value: "256px" },
        { label: "Auto", value: "auto" },
        { label: "100%", value: "100%" },
      ],
    },
    {
      label: "Right",
      key: "padding-right",
      control: Select,
      placeholder: "None",
      options: [
        { label: "4px", value: "4px" },
        { label: "8px", value: "8px" },
        { label: "12px", value: "12px" },
        { label: "16px", value: "16px" },
        { label: "20px", value: "20px" },
        { label: "32px", value: "32px" },
        { label: "48px", value: "48px" },
        { label: "64px", value: "64px" },
        { label: "128px", value: "128px" },
        { label: "256px", value: "256px" },
        { label: "Auto", value: "auto" },
        { label: "100%", value: "100%" },
      ],
    },
    {
      label: "Bottom",
      key: "padding-bottom",
      control: Select,
      placeholder: "None",
      options: [
        { label: "4px", value: "4px" },
        { label: "8px", value: "8px" },
        { label: "12px", value: "12px" },
        { label: "16px", value: "16px" },
        { label: "20px", value: "20px" },
        { label: "32px", value: "32px" },
        { label: "48px", value: "48px" },
        { label: "64px", value: "64px" },
        { label: "128px", value: "128px" },
        { label: "256px", value: "256px" },
        { label: "Auto", value: "auto" },
        { label: "100%", value: "100%" },
      ],
    },
    {
      label: "Left",
      key: "padding-left",
      control: Select,
      placeholder: "None",
      options: [
        { label: "4px", value: "4px" },
        { label: "8px", value: "8px" },
        { label: "12px", value: "12px" },
        { label: "16px", value: "16px" },
        { label: "20px", value: "20px" },
        { label: "32px", value: "32px" },
        { label: "48px", value: "48px" },
        { label: "64px", value: "64px" },
        { label: "128px", value: "128px" },
        { label: "256px", value: "256px" },
        { label: "Auto", value: "auto" },
        { label: "100%", value: "100%" },
      ],
    },
  ],
}

export const size = {
  label: "Size",
  settings: [
    {
      label: "Width",
      key: "width",
      control: Input,
      placeholder: "Auto",
    },
    {
      label: "Height",
      key: "height",
      control: Input,
      placeholder: "Auto",
    },
  ],
}

export const background = {
  label: "Background",
  settings: [
    {
      label: "Color",
      key: "background",
      control: ColorPicker,
    },
    {
      label: "Gradient",
      key: "background-image",
      control: Select,
      options: [
        {
          label: "Warm Flame",
          value:
            "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);",
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
        {
          label: "Peach Kiss",
          value:
            "radial-gradient(circle farthest-corner at 50% 100%,rgba(255,173,138,.50), rgba(255,248,247,1) 100%);",
        },
        {
          label: "Flamingo Sunrise",
          value:
            "-webkit-radial-gradient(center top, rgb(255, 250, 245), rgb(255, 242, 242))",
        },
        {
          label: "Budi Mist",
          value:
            "radial-gradient(circle, rgba(252,215,212,1) 0%, rgba(255,227,214,1) 50%, rgba(207,218,255,1) 100%);",
        },
        {
          label: "Ballet Slipper",
          value:
            "linear-gradient(135deg, rgba(252,215,212,1) 20%, rgba(207,218,255,1) 100%);",
        },
        {
          label: "Black Noir",
          value:
            "linear-gradient(312deg, rgba(60,60,60,1) 0%, rgba(42,42,42,1) 100%);",
        },
      ],
    },
  ],
}

export const border = {
  label: "Border",
  settings: [
    {
      label: "Color",
      key: "border-color",
      control: ColorPicker,
    },
    {
      label: "Width",
      key: "border-width",
      control: Select,
      column: "1 / 2",
      placeholder: "None",
      options: [
        { label: "Small", value: "1px" },
        { label: "Medium", value: "2px" },
        { label: "Large", value: "4px" },
      ],
    },
    {
      label: "Style",
      key: "border-style",
      control: Select,
      column: "2 / 3",
      placeholder: "None",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Dotted", value: "dotted" },
        { label: "Dashed", value: "dashed" },
      ],
    },
    {
      label: "Radius",
      key: "border-radius",
      control: Select,
      placeholder: "None",
      options: [
        { label: "Small", value: "0.25rem" },
        { label: "Medium", value: "0.5rem" },
        { label: "Large", value: "1rem" },
        { label: "Round", value: "100%" },
      ],
    },
    {
      label: "Shadow",
      key: "box-shadow",
      control: Select,
      placeholder: "None",
      options: [
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
            "0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
      ],
    },
  ],
}

export const all = [margin]
