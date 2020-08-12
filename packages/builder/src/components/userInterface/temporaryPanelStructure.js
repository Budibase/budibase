import Input from "../common/Input.svelte"
import OptionSelect from "./OptionSelect.svelte"
import Checkbox from "../common/Checkbox.svelte"
import ModelSelect from "components/userInterface/ModelSelect.svelte"

import { all } from "./propertyCategories.js"
/* 
{ label: "N/A ", value: "N/A" },
{ label: "Flex", value: "flex" },
{ label: "Inline Flex", value: "inline-flex" }, 
*/

export default {
  categories: [
    {
      name: "Basic",
      isCategory: true,
      children: [
        {
          _component: "@budibase/standard-components/container",
          name: "Container",
          description: "This component contains things within itself",
          icon: "ri-layout-row-line",
          commonProps: {},
          children: [],
          properties: {
            design: { ...all },
            settings: [
              {
                key: "type",
                label: "Type",
                control: OptionSelect,
                options: [
                  "article",
                  "aside",
                  "details",
                  "div",
                  "figure",
                  "figcaption",
                  "footer",
                  "header",
                  "main",
                  "mark",
                  "nav",
                  "paragraph",
                  "summary",
                ],
              },
            ],
          },
        },
        {
          _component: "@budibase/standard-components/embed",
          icon: "ri-code-line",
          name: "Embed",
          description: "Embed content from 3rd party sources",
          properties: {
            design: {
              ...all,
            },
            settings: [{ label: "Embed", key: "embed", control: Input }],
          },
        },
        {
          name: "Text",
          description: "This is a simple text component",
          icon: "ri-t-box-line",
          commonProps: {},
          children: [
            {
              _component: "@budibase/standard-components/heading",
              name: "Headline",
              description: "A component for displaying heading text",
              icon: "ri-heading",
              properties: {
                design: { ...all },
                settings: [
                  {
                    key: "text",
                    label: "Text",
                    control: Input,
                  },
                  {
                    key: "type",
                    label: "Type",
                    control: OptionSelect,
                    options: ["h1", "h2", "h3", "h4", "h5", "h6"],
                  },
                ],
              },
            },
            {
              _component: "@budibase/standard-components/text",
              name: "Paragraph",
              description: "A component for displaying paragraph text.",
              icon: "ri-paragraph",
              properties: {
                design: { ...all },
                settings: [
                  {
                    label: "Text",
                    key: "text",
                    control: Input,
                  },
                  {
                    label: "Type",
                    key: "type",
                    control: OptionSelect,
                    options: [
                      "none",
                      "bold",
                      "strong",
                      "italic",
                      "emphasis",
                      "mark",
                      "small",
                      "del",
                      "ins",
                      "sub",
                      "sup",
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "Input",
          description: "These components handle user input.",
          icon: "ri-edit-box-line",
          commonProps: {},
          children: [
            {
              _component: "@budibase/standard-components/input",
              name: "Textfield",
              description:
                "A textfield component that allows the user to input text.",
              icon: "ri-edit-box-line",
              properties: {
                design: { ...all },
                settings: [
                  { label: "Label", key: "label", control: Input },
                  {
                    label: "Type",
                    key: "type",
                    control: OptionSelect,
                    options: ["text", "password"],
                  },
                ],
              },
            },
            {
              _component: "@budibase/standard-components/checkbox",
              name: "Checkbox",
              description: "A selectable checkbox component",
              icon: "ri-checkbox-line",
              properties: {
                design: { ...all },
                settings: [{ label: "Label", key: "label", control: Input }],
              },
            },
            {
              _component: "@budibase/standard-components/radiobutton",
              name: "Radiobutton",
              description: "A selectable radiobutton component",
              icon: "ri-radio-button-line",
              properties: {
                design: { ...all },
                settings: [{ label: "Label", key: "label", control: Input }],
              },
            },
            {
              _component: "@budibase/standard-components/select",
              name: "Select",
              description:
                "A select component for choosing from different options",
              icon: "ri-file-list-line",
              properties: {
                design: { ...all },
                settings: [],
              },
            },
          ],
        },
        {
          _component: "@budibase/standard-components/button",
          name: "Button",
          description: "A basic html button that is ready for styling",
          icon: "ri-share-box-line",
          children: [],
          properties: {
            design: {
              ...all,
            },
            settings: [
              { label: "Text", key: "text", control: Input },
              {
                label: "Disabled",
                key: "disabled",
                valueKey: "checked",
                control: Checkbox,
              },
            ],
          },
        },
        {
          _component: "@budibase/standard-components/image",
          name: "Image",
          description: "A basic component for displaying images",
          icon: "ri-image-line",
          children: [],
          properties: {
            design: { ...all },
            settings: [{ label: "URL", key: "url", control: Input }],
          },
        },
        // {
        // _component: "@budibase/standard-components/icon",
        // name: "Icon",
        // description: "A basic component for displaying icons",
        // icon: "ri-sun-fill",
        // children: [],
        // properties: {
        // design: { ...all },
        // },
        // },
        {
          _component: "@budibase/standard-components/link",
          name: "Link",
          description: "A basic link component for internal and external links",
          icon: "ri-link",
          children: [],
          properties: {
            design: { ...all },
            settings: [
              { label: "Text", key: "text", control: Input },
              { label: "Url", key: "url", control: Input },
              {
                label: "Open New Tab",
                key: "openInNewTab",
                valueKey: "checked",
                control: Checkbox,
              },
            ],
          },
        },
      ],
    },
    {
      name: "Blocks",
      isCategory: true,
      children: [
        {
          name: "List",
          _component: "@budibase/standard-components/list",
          description: "Renders all children once per record, of a given table",
          icon: "ri-file-list-line",
          properties: {
            design: { ...all },
            settings: [{ label: "Table", key: "model", control: ModelSelect }],
          },
          children: [],
        },
        {
          _component: "@budibase/standard-components/stackedlist",
          name: "Stacked List",
          description:
            "A basic card component that can contain content and actions.",
          icon: "ri-archive-drawer-line",
          children: [],
          properties: {
            design: { ...all },
            settings: [
              {
                label: "Image",
                key: "imageUrl",
                control: Input,
                placeholder: "{{{context.Image}}}",
              },
              {
                label: "Heading",
                key: "heading",
                control: Input,
                placeholder: "{{context.Heading}}",
              },
              {
                label: "Text 1",
                key: "text1",
                control: Input,
                placeholder: "{{context.Text 1}}",
              },
              {
                label: "Text 2",
                key: "text2",
                control: Input,
                placeholder: "{{context.Text 2}}",
              },
              {
                label: "Text 3",
                key: "text3",
                control: Input,
                placeholder: "{{context.Text 3}}",
              },
              {
                label: "destinationUrl",
                key: "destinationUrl",
                control: Input,
                placeholder: "/table/_id",
              },
            ],
          },
        },
        {
          _component: "@budibase/materialdesign-components/BasicCard",
          name: "Card",
          description:
            "A basic card component that can contain content and actions.",
          icon: "ri-layout-bottom-line",
          children: [],
          properties: {
            design: { ...all },
            settings: [
              {
                label: "Heading",
                key: "heading",
                control: Input,
                placeholder: "text",
              },
              {
                label: "Subheading",
                key: "subheading",
                control: Input,
                placeholder: "text",
              },
              {
                label: "Content",
                key: "content",
                control: Input,
                placeholder: "text",
              },
              {
                label: "Image",
                key: "imageUrl",
                control: Input,
                placeholder: "src",
              },
            ],
          },
        },
        {
          name: "Table",
          _component: "@budibase/standard-components/datatable",
          description: "A component that generates a table from your data.",
          icon: "ri-archive-drawer-line",
          properties: {
            design: { ...all },
            settings: [
              { label: "Model", key: "model", control: ModelSelect },
              { label: "Stripe Color", key: "stripeColor", control: Input },
              { label: "Border Color", key: "borderColor", control: Input },
              { label: "TH Color", key: "backgroundColor", control: Input },
              { label: "TH Font Color", key: "color", control: Input },
              { label: "Table", key: "model", control: ModelSelect },
            ],
          },
          children: [],
        },
        {
          name: "Form",
          description: "A component that generates a form from your data.",
          icon: "ri-file-edit-line",
          commonProps: {},
          children: [
            {
              _component: "@budibase/standard-components/dataform",
              name: "Form Basic",
              icon: "ri-file-edit-line",
              properties: {
                design: { ...all },
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Title",
                    key: "title",
                    control: Input,
                  },
                  {
                    label: "Button Text",
                    key: "buttonText",
                    control: Input,
                  },
                ],
              },
              template: {
                component: "@budibase/materialdesign-components/Form",
                description: "Form for saving a record",
                name: "@budibase/materialdesign-components/recordForm",
              },
            },
            {
              _component: "@budibase/standard-components/dataformwide",
              name: "Form Wide",
              icon: "ri-file-edit-line",
              properties: {
                design: { ...all },
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Title",
                    key: "title",
                    control: Input,
                  },
                  {
                    label: "Button Text",
                    key: "buttonText",
                    control: Input,
                  },
                ],
              },
            },
          ],
        },
        {
          name: "Data Chart",
          _component: "@budibase/standard-components/datachart",
          description: "Shiny chart",
          icon: "ri-bar-chart-line",
          properties: {
            design: { ...all },
            settings: [
              { label: "Table", key: "model", control: ModelSelect },
              {
                label: "Chart Type",
                key: "type",
                control: OptionSelect,
                options: [
                  "column2d",
                  "column3d",
                  "line",
                  "area2d",
                  "bar2d",
                  "bar3d",
                  "pie2d",
                  "pie3d",
                  "doughnut2d",
                  "doughnut3d",
                  "pareto2d",
                  "pareto3d",
                ],
              },
            ],
          },
          children: [],
        },
        {
          name: "Chart",
          description: "Shiny chart",
          icon: "ri-bar-chart-fill",
          children: [
            {
              name: "Donut",
              _component: "@budibase/standard-components/donut",
              description: "Donut chart",
              icon: "ri-donut-chart-line",
              presetProps: {
                data: [
                  {
                    quantity: 1,
                    percentage: 50,
                    name: "glittering",
                    id: 1,
                  },
                  {
                    quantity: 1,
                    percentage: 50,
                    name: "luminous",
                    id: 2,
                  },
                ],
              },
              properties: {
                design: {
                  ...all,
                },
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Animate Chart",
                    key: "isAnimated",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    label: "Keep Last Hover",
                    key: "hasLastHoverSliceHighlighted",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    label: "Hover Highlight",
                    key: "hasHoverAnimation",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    label: "Colors",
                    key: "color",
                    control: OptionSelect,
                    options: [
                      "britecharts",
                      "blueGreen",
                      "green",
                      "grey",
                      "orange",
                      "pink",
                      "purple",
                      "red",
                      "teal",
                      "yellow",
                    ],
                  },
                  {
                    label: "External Radius",
                    key: "externalRadius",
                    control: Input,
                  },
                  {
                    label: "Internal Radius",
                    key: "internalRadius",
                    control: Input,
                  },
                  {
                    label: "Radius Offset",
                    key: "radiusHoverOffset ",
                    control: Input,
                  },
                  {
                    label: "Show Legend",
                    key: "useLegend ",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    label: "Horizontal Legend",
                    key: "horizontalLegend",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    label: "Legend Width",
                    key: "legendWidth",
                    control: Input,
                  },
                  {
                    label: "Legend Height",
                    key: "legendHeight",
                    control: Input,
                  },
                ],
              },
            },
            {
              name: "Heatmap",
              _component: "@budibase/standard-components/heatmap",
              description: "Heatmap chart",
              icon: "ri-bar-chart-fill",
              presetProps: {
                data: [
                  {
                    day: 0,
                    hour: 0,
                    value: 7,
                  },
                  {
                    day: 0,
                    hour: 1,
                    value: 10,
                  },
                ],
              },
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Color",
                    key: "color",
                    control: OptionSelect,
                    options: [
                      "britecharts",
                      "blueGreen",
                      "green",
                      "grey",
                      "orange",
                      "pink",
                      "purple",
                      "red",
                      "teal",
                      "yellow",
                    ],
                  },
                  {
                    label: "Show Legend",
                    key: "useLegend ",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    label: "Height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Width",
                    key: "width",
                    control: Input,
                  },
                  {
                    label: "Boxsize",
                    key: "boxSize",
                    control: Input,
                  },
                ],
              },
            },
            {
              name: "Scatterplot",
              _component: "@budibase/standard-components/scatterplot",
              description: "Scatterplot chart",
              icon: "ri-bar-chart-fill",
              presetProps: {
                data: [
                  {
                    name: "topic",
                    x: 123,
                    y: 24,
                  },
                  {
                    name: "topic1",
                    x: 53,
                    y: 31,
                  },
                  {
                    name: "topic2",
                    x: 631,
                    y: 321,
                  },
                  {
                    name: "topic1",
                    x: 231,
                    y: 111,
                  },
                ],
              },
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Colors",
                    key: "color",
                    control: OptionSelect,
                    options: [
                      { label: "Normal", value: "britecharts" },
                      { label: "Blue Green", value: "blueGreen" },
                      { label: "Green", value: "green" },
                      { label: "Grey", value: "grey" },
                      { label: "Orange", value: "orange" },
                      { label: "Pink", value: "pink" },
                      { label: "Purple", value: "purple" },
                      { label: "Red", value: "red" },
                      { label: "Teal", value: "teal" },
                      { label: "Yellow", value: "yellow" },
                    ],
                  },
                  {
                    label: "height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Width",
                    key: "width",
                    control: Input,
                  },
                  {
                    label: "Aspect Ratio",
                    key: "aspectRatio",
                    control: Input,
                  },
                  {
                    label: "Circle Opacity",
                    key: "circleOpacity",
                    control: Input,
                  },
                  {
                    label: "Grid",
                    key: "grid",
                    control: OptionSelect,
                    options: ["vertical", "horizontal", "full"],
                  },
                  {
                    label: "Has Crosshairs",
                    key: "hasCrossHairs",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    label: "Is Animated",
                    key: "isAnimated",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    label: "Max Circle Area",
                    key: "maxCircleArea",
                    control: Input,
                  },
                  {
                    label: "X Axis Label",
                    key: "xAxisLabel",
                    control: Input,
                  },
                  {
                    label: "X Axis Label Offset",
                    key: "xAxisLabelOffset",
                    control: Input,
                  },
                  {
                    label: "X Axis",
                    key: "xTicks",
                    control: Input,
                  },
                  {
                    label: "Y Axis Format",
                    key: "yAxisFormat",
                    control: Input,
                  },
                  {
                    label: "Y Axis Label",
                    key: "yAxisLabel",
                    control: Input,
                  },
                  {
                    label: "Y Axis Label Offset",
                    key: "yAxisLabelOffset",
                    control: Input,
                  },
                  {
                    label: "Y Ticks",
                    key: "yTicks",
                    control: Input,
                  },
                ],
              },
            },
            {
              name: "StackedArea",
              _component: "@budibase/standard-components/stackedarea",
              description: "StackedArea chart",
              icon: "ri-bar-chart-fill",
              presetProps: {
                data: [
                  {
                    date: "2011-01-05T00:00:00Z",
                    name: "Direct",
                    value: 0,
                  },
                ],
              },
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Color",
                    key: "color",
                    control: OptionSelect,
                    options: [
                      "britecharts",
                      "blueGreen",
                      "green",
                      "grey",
                      "orange",
                      "pink",
                      "purple",
                      "red",
                      "teal",
                      "yellow",
                    ],
                  },
                  {
                    label: "Height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Width",
                    key: "width",
                    control: Input,
                  },
                  {
                    label: "Aspect Ratio",
                    key: "aspectRatio",
                    control: Input,
                  },
                  {
                    label: "Height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Grid",
                    key: "grid",
                    control: OptionSelect,
                    options: ["vertical", "horizontal", "full"],
                  },
                  {
                    label: "X Axis Label",
                    key: "xAxisLabel",
                    control: Input,
                  },
                  {
                    label: "X Axis Label Offset",
                    key: "xAxisLabelOffset",
                    control: Input,
                  },
                  {
                    label: "Y Axis",
                    key: "yAxisLabel",
                    control: Input,
                  },
                  {
                    label: "Y Axis Label Offset",
                    key: "yAxisLabelOffset",
                    control: Input,
                  },
                  {
                    label: "Area Curve",
                    key: "areaCurve",
                    control: Input,
                  },
                  {
                    label: "Area Opacity",
                    key: "areaOpacity",
                    control: Input,
                  },
                  {
                    label: "Area Opacity",
                    key: "areaOpacity",
                    control: Input,
                  },
                  {
                    label: "dateLabel",
                    key: "dateLabel",
                    control: Input,
                  },
                  {
                    key: "isAnimated",
                    label: "Is Animated",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    label: "Key Label",
                    key: "keyLabel",
                    control: Input,
                  },
                  {
                    label: "Locale",
                    key: "locale",
                    control: Input,
                  },
                  {
                    label: "Value Label",
                    key: "valueLabel",
                    control: Input,
                  },
                  {
                    label: "Use Legend",
                    key: "useLegend",
                    keyValue: "checked",
                    control: Checkbox,
                  },
                ],
              },
            },
            {
              name: "Step",
              _component: "@budibase/standard-components/step",
              description: "Step chart",
              icon: "ri-bar-chart-fill",
              presetProps: {
                data: [
                  {
                    value: 1,
                    key: "glittering",
                  },
                  {
                    value: 2,
                    key: "luminous",
                  },
                ],
              },
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Width",
                    key: "width",
                    control: Input,
                  },
                  {
                    label: "Y Axis Label",
                    key: "yAxisLabel",
                    control: Input,
                  },
                  {
                    label: "Y Axis Label Offset",
                    key: "yAxisLabelOffset",
                    control: Input,
                  },
                  {
                    label: "Y Ticks",
                    key: "yTicks",
                    control: Input,
                  },
                  {
                    label: "X Axis Label Offset",
                    key: "xAxisLabelOffset",
                    control: Input,
                  },
                ],
              },
            },
            {
              name: "Sparkline",
              _component: "@budibase/standard-components/sparkline",
              description: "Sparkline chart",
              icon: "ri-bar-chart-fill",
              presetProps: {
                data: [
                  {
                    value: 1,
                    date: "2011-01-06T00:00:00Z",
                  },
                  {
                    value: 2,
                    date: "2011-01-07T00:00:00Z",
                  },
                ],
              },
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Line Gradient",
                    key: "lineGradient",
                    control: OptionSelect,
                    options: [
                      { value: "", label: "None" },
                      { value: "bluePurple", label: "Blue Purple" },
                      { value: "greenBlue", label: "Green Blue" },
                      { value: "orangePink", label: "Orange Pink" },
                    ],
                  },
                  {
                    label: "Area Gradient",
                    key: "areaGradient",
                    control: OptionSelect,
                    options: [
                      { value: "", label: "None" },
                      { value: "bluePurple", label: "Blue Purple" },
                      { value: "greenBlue", label: "Green Blue" },
                      { value: "orangePink", label: "Orange Pink" },
                    ],
                  },
                  {
                    key: "height",
                    label: "Height",
                    control: Input,
                  },
                  {
                    key: "width",
                    label: "Width",
                    control: Input,
                  },
                  {
                    key: "dateLabel",
                    label: "Date Label",
                    control: Input,
                  },
                  {
                    key: "isAnimated",
                    label: "Is Animated",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    key: "titleText",
                    label: "Title Text",
                    control: Input,
                  },
                  {
                    key: "valueLabel",
                    label: "Value Label",
                    control: Input,
                  },
                ],
              },
            },
            {
              name: "Bar",
              _component: "@budibase/standard-components/bar",
              description: "Bar chart",
              icon: "ri-bar-chart-fill",
              presetProps: {
                data: [
                  {
                    value: 1,
                    name: "glittering",
                  },
                  {
                    value: 1,
                    name: "luminous",
                  },
                ],
              },
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Name Label",
                    key: "nameLabel",
                    control: Input,
                  },
                  {
                    label: "Value Label",
                    key: "valueLabel",
                    control: Input,
                  },
                  {
                    label: "Y Axis Label",
                    key: "yAxisLabel",
                    control: Input,
                  },
                  {
                    label: "X Axis Label",
                    key: "xAxisLabel",
                    control: Input,
                  },
                  {
                    label: "X Axis Label Offset",
                    key: "xAxisLabelOffset",
                    control: Input,
                  },
                  {
                    label: "Y Axis Label Offset",
                    key: "yAxisLabelOffset",
                    control: Input,
                  },
                  {
                    label: "Enable Labels",
                    key: "enableLabels",
                    control: Checkbox,
                    valueKey: "checked",
                  },
                  {
                    label: "Colors",
                    key: "color",
                    control: OptionSelect,
                    options: [
                      { label: "Normal", value: "britecharts" },
                      { label: "Blue Green", value: "blueGreen" },
                      { label: "Green", value: "green" },
                      { label: "Grey", value: "grey" },
                      { label: "Orange", value: "orange" },
                      { label: "Pink", value: "pink" },
                      { label: "Purple", value: "purple" },
                      { label: "Red", value: "red" },
                      { label: "Teal", value: "teal" },
                      { label: "Yellow", value: "yellow" },
                    ],
                  },
                  {
                    label: "Gradients",
                    key: "gradient",
                    control: OptionSelect,
                    options: [
                      { value: "", label: "None" },
                      { value: "bluePurple", label: "Blue Purple" },
                      { value: "greenBlue", label: "Green Blue" },
                      { value: "orangePink", label: "Orange Pink" },
                    ],
                  },
                  {
                    label: "Highlight Single Bar",
                    key: "hasSingleBarHighlight",
                    control: Checkbox,
                    valueKey: "checked",
                  },
                  {
                    label: "Width",
                    key: "width",
                    control: Input,
                  },
                  {
                    label: "Height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Animate",
                    key: "isAnimate",
                    control: Checkbox,
                    valueKey: "checked",
                  },
                  {
                    label: "Horizontal",
                    key: "isHorizontal",
                    control: Checkbox,
                    valueKey: "checked",
                  },
                  {
                    label: "Label Number Format",
                    key: "labelsNumberFormat",
                    control: Input,
                  },
                  {
                    label: "Label Size",
                    key: "labelSize",
                    control: Input,
                  },
                ],
              },
            },
            {
              name: "Brush",
              _component: "@budibase/standard-components/brush",
              description: "Brush chart",
              icon: "ri-bar-chart-fill",
              presetProps: {
                data: [
                  {
                    value: 1,
                    date: "2011-01-06T00:00:00Z",
                  },
                  {
                    value: 2,
                    date: "2011-01-07T00:00:00Z",
                  },
                ],
              },
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Gradient",
                    key: "gradient",
                    control: OptionSelect,
                    options: [
                      { value: "", label: "None" },
                      { value: "bluePurple", label: "Blue Purple" },
                      { value: "greenBlue", label: "Green Blue" },
                      { value: "orangePink", label: "Orange Pink" },
                    ],
                  },
                  {
                    label: "Height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Width",
                    key: "width",
                    control: Input,
                  },
                  {
                    label: "Date Range",
                    key: "dateRange",
                    control: Input,
                  },
                  {
                    label: "Locale",
                    key: "locale",
                    control: Input,
                  },
                  {
                    label: "Time Interval",
                    key: "roundingTimeInterval",
                    control: OptionSelect,
                    options: [
                      "timeDay",
                      "timeMillisecond",
                      "utcMillisecond",
                      "timeSecond",
                      "utcSecond",
                      "timeMinute",
                      "utcMinute",
                      "timeHour",
                      "utcHour",
                      "utcDay",
                      "timeWeek",
                      "utcWeek",
                      "timeSunday",
                      "utcSunday",
                      "timeMonday",
                      "utcMonday",
                      "timeTuesday",
                      "utcTuesday",
                      "timeWednesday",
                      "utcWednesday",
                      "timeThursday",
                      "utcThursday",
                      "timeFriday",
                      "utcFriday",
                      "timeSaturday",
                      "utcSaturday",
                      "timeMonth",
                      "utcMonth",
                      "timeYear",
                      "utcYear",
                    ],
                  },
                  {
                    label: "X Axis Format",
                    key: "xAxisFormat",
                    control: OptionSelect,
                    options: [
                      "day-month",
                      "minute-hour",
                      "hour-daymonth",
                      "month-year",
                      "custom",
                    ],
                  },
                  {
                    label: "X Ticks",
                    key: "xTicks",
                    control: Input,
                  },
                ],
              },
            },
            {
              name: "Groupedbar",
              _component: "@budibase/standard-components/groupedbar",
              description: "Groupedbar chart",
              icon: "ri-bar-chart-fill",
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Color",
                    key: "color",
                    control: OptionSelect,
                    options: [
                      "britecharts",
                      "blueGreen",
                      "green",
                      "grey",
                      "orange",
                      "pink",
                      "purple",
                      "red",
                      "teal",
                      "yellow",
                    ],
                  },
                  {
                    label: "Height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Width",
                    key: "width",
                    control: Input,
                  },
                  {
                    label: "Aspect Ratio",
                    key: "aspectRatio",
                    control: Input,
                  },
                  {
                    label: "Grid",
                    key: "grid",
                    control: OptionSelect,
                    options: ["vertical", "horizontal", "full"],
                  },
                  {
                    label: "Group Label",
                    key: "groupLabel",
                    control: Input,
                  },
                  {
                    label: "Name Label",
                    key: "nameLabel",
                    control: Input,
                  },
                  {
                    label: "Value Label",
                    key: "valueLabel",
                    control: Input,
                  },
                  {
                    label: "Y Ticks",
                    key: "yTicks",
                    control: Input,
                  },
                  {
                    label: "Y Tick Text Offset",
                    key: "yTickTextOffset",
                    control: Input,
                  },
                  {
                    label: "Is Animated",
                    key: "isAnimated",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                  {
                    label: "Is Horizontal",
                    key: "isHorizontal",
                    valueKey: "checked",
                    control: Checkbox,
                  },
                ],
              },
            },
            {
              name: "Bullet",
              _component: "@budibase/standard-components/bullet",
              description: "Bullet chart",
              icon: "ri-bar-chart-fill",
              presetProps: {
                data: {
                  ranges: [130, 160, 250],
                  measures: [150, 180],
                  markers: [175],
                },
              },
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Color",
                    key: "color",
                    control: OptionSelect,
                    options: [
                      "britecharts",
                      "blueGreen",
                      "green",
                      "grey",
                      "orange",
                      "pink",
                      "purple",
                      "red",
                      "teal",
                      "yellow",
                    ],
                  },
                  {
                    label: "Title",
                    key: "title",
                    control: Input,
                  },
                  {
                    label: "Subtitle",
                    key: "subtitle",
                    control: Input,
                  },
                  {
                    label: "Axis Padding",
                    key: "paddingBetweenAxisAndChart",
                    control: Input,
                  },
                  {
                    label: "Height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Width",
                    key: "width",
                    control: Input,
                  },
                ],
              },
            },
            {
              name: "Stacked Bar",
              _component: "@budibase/standard-components/stackedbar",
              description: "Stacked Bar Chart",
              icon: "ri-file-list-fill",
              presetProps: {
                data: [
                  {
                    name: "2011-01",
                    stack: "Direct",
                    value: 0,
                  },
                ],
              },
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Colors",
                    key: "color",
                    control: OptionSelect,
                    options: [
                      "britecharts",
                      "blueGreen",
                      "green",
                      "grey",
                      "orange",
                      "pink",
                      "purple",
                      "red",
                      "teal",
                      "yellow",
                    ],
                  },
                  {
                    label: "Grid",
                    key: "grid",
                    control: OptionSelect,
                    options: ["vertical", "horizontal", "full"],
                  },
                  {
                    label: "Aspect Ratio",
                    key: "aspectRatio",
                    control: Input,
                  },
                  {
                    label: "Between Bars Padding",
                    key: "betweenBarsPadding",
                    control: Input,
                  },
                  {
                    label: "Max Ratio Percentage",
                    key: "percentageToMaxRatio",
                    control: Input,
                  },
                  {
                    label: "Date Label",
                    key: "dateLabel",
                    control: Input,
                  },
                  {
                    label: "Name Label",
                    key: "nameLabel",
                    control: Input,
                  },
                  {
                    label: "Stack Label",
                    key: "stackLabel",
                    control: Input,
                  },
                  {
                    label: "Width",
                    key: "width",
                    control: Input,
                  },
                  {
                    label: "Height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Locale",
                    key: "locale",
                    control: Input,
                  },
                  {
                    label: "Is Animated",
                    key: "isAnimated",
                    control: Checkbox,
                    valueKey: "checked",
                  },
                  {
                    label: "Is Horizontal",
                    key: "isHorizontal",
                    control: Checkbox,
                    valueKey: "checked",
                  },
                  {
                    label: "Has Reversed Stacks",
                    key: "hasReversedStacks",
                    control: Checkbox,
                    valueKey: "checked",
                  },
                  {
                    label: "Has Percentage",
                    key: "hasPercentage",
                    control: Checkbox,
                    valueKey: "checked",
                  },
                  {
                    label: "X Ticks",
                    key: "xTicks",
                    control: Input,
                  },
                  {
                    label: "Y Ticks",
                    key: "yTicks",
                    control: Input,
                  },
                  {
                    label: "Y Axis Label",
                    key: "yTicksLabel",
                    control: Input,
                  },
                  {
                    label: "Y Axis Label Offset",
                    key: "yAxisLabelOffset",
                    control: Input,
                  },
                ],
              },
            },
            {
              name: "Line",
              _component: "@budibase/standard-components/line",
              description: "Line chart",
              icon: "ri-bar-chart-fill",
              properties: {
                settings: [
                  {
                    label: "Table",
                    key: "model",
                    control: ModelSelect,
                  },
                  {
                    label: "Colors",
                    key: "color",
                    control: OptionSelect,
                    options: [
                      "britecharts",
                      "blueGreen",
                      "green",
                      "grey",
                      "orange",
                      "pink",
                      "purple",
                      "red",
                      "teal",
                      "yellow",
                    ],
                  },
                  {
                    label: "X Axis Value Type",
                    key: "xAxisValueType",
                    control: OptionSelect,
                    options: ["date", "number"],
                  },
                  {
                    label: "Grid",
                    key: "grid",
                    control: OptionSelect,
                    options: ["vertical", "horizontal", "full"],
                  },
                  {
                    label: "Aspect Ratio",
                    key: "aspectRatio",
                    control: Input,
                  },
                  {
                    label: "Date Label",
                    key: "dateLabel",
                    control: Input,
                  },
                  {
                    label: "Topic Label",
                    key: "topicLabel",
                    control: Input,
                  },
                  {
                    label: "Value Label",
                    key: "valueLabel",
                    control: Input,
                  },
                  {
                    label: "Width",
                    key: "width",
                    control: Input,
                  },
                  {
                    label: "Height",
                    key: "height",
                    control: Input,
                  },
                  {
                    label: "Is Animated",
                    key: "isAnimated",
                    control: Checkbox,
                    valueKey: "checked",
                  },
                  {
                    label: "Line Curve",
                    key: "lineCurve",
                    control: OptionSelect,
                    options: [
                      "linear",
                      "basis",
                      "natural",
                      "monotoneX",
                      "monotoneY",
                      "step",
                      "stepAfter",
                      "stepBefore",
                      "cardinal",
                      "catmullRom",
                    ],
                  },
                  {
                    label: "X Axis Label",
                    key: "xAxisLabel",
                    control: Input,
                  },
                  {
                    label: "X Axis Value Type",
                    key: "xAxisValueType",
                    control: OptionSelect,
                    options: ["date", "number"],
                  },
                  {
                    label: "X Axis Scale",
                    key: "xAxisScale",
                    control: OptionSelect,
                    options: ["linear", "logarithmic"],
                  },
                  {
                    label: "X Axis Format",
                    key: "xAxisFormat",
                    control: OptionSelect,
                    options: [
                      "day-month",
                      "minute-hour",
                      "hour-daymonth",
                      "month-year",
                      "custom",
                    ],
                  },
                  {
                    label: "X Axis Custom Format",
                    key: "xAxisCustomFormat",
                    control: Input,
                  },
                  {
                    label: "X Axis Label",
                    key: "xAxisLabel",
                    control: Input,
                  },
                ],
              },
            },
          ],
        },
        {
          name: "Data List",
          _component: "@budibase/standard-components/datalist",
          description: "Shiny list",
          icon: "ri-file-list-fill",
          properties: {
            design: { ...all },
            settings: [{ label: "Table", key: "model", control: ModelSelect }],
          },
          children: [],
        },
        {
          name: "List",
          _component: "@budibase/standard-components/list",
          description: "Renders all children once per record, of a given table",
          icon: "ri-file-list-fill",
          properties: {
            design: { ...all },
            settings: [{ label: "Table", key: "model", control: ModelSelect }],
          },
          children: [
            {
              _component: "@budibase/standard-components/heading",
              name: "Headline",
              description: "A component for displaying heading text",
              icon: "ri-heading",
            },
          ],
        },
        // {
        //  name: "Data List",
        //  _component: "@budibase/standard-components/datalist",
        //  description: "Shiny list",
        //  icon: "ri-file-list-line",
        //  properties: {
        //   design: { ...all },
        //   settings: [{ label: "Table", key: "model", control: ModelSelect }],
        //  },
        //  children: [],
        // },
        {
          name: "Record Detail",
          _component: "@budibase/standard-components/recorddetail",
          description:
            "Loads a record, using an id from the URL, which can be used with {{ context }}, in children",
          icon: "ri-profile-line",
          properties: {
            design: { ...all },
            settings: [{ label: "Table", key: "model", control: ModelSelect }],
          },
          children: [],
        },
        // {
        // name: "Map",
        // _component: "@budibase/standard-components/datamap",
        // description: "Shiny map",
        // icon: "ri-map-pin-line",
        // properties: { design: { ...all } },
        // children: [],
        // },
      ],
    },
    {
      name: "Layouts",
      isCategory: true,
      children: [
        {
          _component: "##builtin/screenslot",
          name: "Screen Slot",
          description:
            "This component is a placeholder for the rendering of a screen within a page.",
          icon: "ri-crop-2-line",
          properties: { design: { ...all } },
          commonProps: {},
          children: [],
        },
        {
          name: "Nav Bar",
          _component: "@budibase/standard-components/Navigation",
          description:
            "A component for handling the navigation within your app.",
          icon: "ri-navigation-line",
          children: [],
          properties: {
            design: { ...all },
            settings: [
              { label: "Logo URL", key: "logoUrl", control: Input },
              { label: "Title", key: "title", control: Input },
              { label: "Color", key: "color", control: Input },
              { label: "Background", key: "backgroundColor", control: Input },
            ],
          },
        },
        {
          name: "Login",
          _component: "@budibase/standard-components/login",
          description:
            "A component that automatically generates a login screen for your app.",
          icon: "ri-login-box-line",
          children: [],
          properties: {
            design: { ...all },
            settings: [
              {
                label: "Name",
                key: "name",
                control: Input,
              },
              {
                label: "Logo",
                key: "logo",
                control: Input,
              },
              {
                label: "Title",
                key: "title",
                control: Input,
              },
              {
                label: "Button Text",
                key: "buttonText",
                control: Input,
              },
            ],
          },
        },
      ],
    },
  ],
}
