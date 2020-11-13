import Input from "./PropertyPanelControls/Input.svelte"
import OptionSelect from "./OptionSelect.svelte"
import MultiTableViewFieldSelect from "./MultiTableViewFieldSelect.svelte"
import Checkbox from "../common/Checkbox.svelte"
import TableSelect from "components/userInterface/TableSelect.svelte"
import TableViewSelect from "components/userInterface/TableViewSelect.svelte"
import TableViewFieldSelect from "components/userInterface/TableViewFieldSelect.svelte"
import Event from "components/userInterface/EventsEditor/EventPropertyControl.svelte"
import ScreenSelect from "components/userInterface/ScreenSelect.svelte"
import DetailScreenSelect from "components/userInterface/DetailScreenSelect.svelte"
import { IconSelect } from "components/userInterface/IconSelect"
import Colorpicker from "@budibase/colorpicker"

import { all } from "./propertyCategories.js"
/* 
{ label: "N/A ", value: "N/A" },
{ label: "Flex", value: "flex" },
{ label: "Inline Flex", value: "inline-flex" }, 
*/

export default {
  categories: [
    {
      _component: "@budibase/standard-components/container",
      name: "Container",
      description: "This component contains things within itself",
      icon: "ri-layout-column-line",
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
      name: "Grid",
      _component: "@budibase/standard-components/datagrid",
      description:
        "a datagrid component with functionality to add, remove and edit rows.",
      icon: "ri-grid-line",
      properties: {
        design: { ...all },
        settings: [
          {
            label: "Source",
            key: "datasource",
            control: TableViewSelect,
          },
          {
            label: "Detail URL",
            key: "detailUrl",
            control: DetailScreenSelect,
          },
          {
            label: "Editable",
            key: "editable",
            valueKey: "checked",
            control: Checkbox,
          },
          {
            label: "Theme",
            key: "theme",
            control: OptionSelect,
            options: [
              "alpine",
              "alpine-dark",
              "balham",
              "balham-dark",
              "material",
            ],
            placeholder: "alpine",
          },
          {
            label: "Height",
            key: "height",
            defaultValue: "500",
            control: Input,
          },
          {
            label: "Pagination",
            key: "pagination",
            valueKey: "checked",
            control: Checkbox,
          },
        ],
      },
      children: [],
    },
    {
      name: "Repeater",
      _component: "@budibase/standard-components/list",
      description: "Renders all children once per row, of a given table",
      icon: "ri-list-check-2",
      properties: {
        design: { ...all },
        settings: [
          {
            label: "Data",
            key: "datasource",
            control: TableViewSelect,
          },
        ],
      },
      children: [],
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
          { label: "On Click", key: "onClick", control: Event },
        ],
      },
    },
    {
      name: "Form",
      icon: "ri-file-edit-line",
      isCategory: true,
      children: [
        {
          _component: "@budibase/standard-components/dataform",
          name: "Form Basic",
          icon: "ri-file-edit-line",
          properties: {
            design: { ...all },
            settings: [],
          },
        },
        {
          _component: "@budibase/standard-components/dataformwide",
          name: "Form Wide",
          icon: "ri-file-edit-line",
          properties: {
            design: { ...all },
            settings: [],
          },
        },
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
        // {
        //   _component: "@budibase/standard-components/richtext",
        //   name: "Rich Text",
        //   description:
        //     "A component that allows the user to enter long form text.",
        //   icon: "ri-edit-box-line",
        //   properties: {
        //     design: { ...all },
        //     settings: [],
        //   },
        // },
        {
          _component: "@budibase/standard-components/datepicker",
          name: "Date Picker",
          description: "A basic date picker component",
          icon: "ri-calendar-line",
          children: [],
          properties: {
            design: { ...all },
            settings: [
              { label: "Placeholder", key: "placeholder", control: Input },
            ],
          },
        },
      ],
    },
    {
      name: "Card",
      icon: "ri-archive-drawer-line",
      isCategory: true,
      children: [
        {
          _component: "@budibase/standard-components/stackedlist",
          name: "Stacked List",
          icon: "ri-archive-drawer-line",
          description:
            "A basic card component that can contain content and actions.",
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
                label: "Link URL",
                key: "destinationUrl",
                control: ScreenSelect,
                placeholder: "/table/_id",
              },
            ],
          },
        },
        {
          _component: "@budibase/standard-components/card",
          name: "Vertical",
          description:
            "A basic card component that can contain content and actions.",
          icon: "ri-layout-column-line",
          children: [],
          properties: {
            design: { ...all },
            settings: [
              {
                label: "Image",
                key: "imageUrl",
                control: Input,
                placeholder: "Image",
              },
              {
                label: "Heading",
                key: "heading",
                control: Input,
                placeholder: "Heading",
              },
              {
                label: "Description",
                key: "description",
                control: Input,
                placeholder: "Description",
              },
              {
                label: "Link Text",
                key: "linkText",
                control: Input,
                placeholder: "Link Text",
              },
              {
                label: "Link Url",
                key: "linkUrl",
                control: ScreenSelect,
                placeholder: "Link URL",
              },
              {
                label: "Link Color",
                key: "color",
                control: Input,
                placeholder: "Link Color",
              },
              {
                label: "Hover Color",
                key: "linkHoverColor",
                control: Input,
                placeholder: "Hover Color",
              },
              {
                label: "Image Height",
                key: "imageHeight",
                control: OptionSelect,
                options: ["12rem", "16rem", "20rem", "24rem"],
                placeholder: "Image Height",
              },
              {
                label: "Card Width",
                key: "cardWidth",
                control: OptionSelect,
                options: ["16rem", "20rem", "24rem"],
                placeholder: "Card Width",
              },
            ],
          },
        },
        {
          _component: "@budibase/standard-components/cardhorizontal",
          name: "Horizontal",
          description:
            "A basic card component that can contain content and actions.",
          icon: "ri-layout-row-line",
          children: [],
          properties: {
            design: { ...all },
            settings: [
              {
                label: "Image",
                key: "imageUrl",
                control: Input,
                placeholder: "Image",
              },
              {
                label: "Heading",
                key: "heading",
                control: Input,
                placeholder: "Heading",
              },
              {
                label: "Description",
                key: "description",
                control: Input,
                placeholder: "Description",
              },
              {
                label: "Subtext",
                key: "subtext",
                control: Input,
                placeholder: "Subtext",
              },
              {
                label: "Link Text",
                key: "linkText",
                control: Input,
                placeholder: "Link Text",
              },
              {
                label: "Link Url",
                key: "linkUrl",
                control: ScreenSelect,
                placeholder: "Link URL",
              },
              {
                label: "Link Color",
                key: "color",
                control: Input,
                placeholder: "Link Color",
              },
              {
                label: "Hover Color",
                key: "linkHoverColor",
                control: Input,
                placeholder: "Hover Color",
              },
              {
                label: "Card Width",
                key: "cardWidth",
                control: OptionSelect,
                options: [
                  "24rem",
                  "28rem",
                  "32rem",
                  "40rem",
                  "48rem",
                  "60rem",
                  "100%",
                ],
                placeholder: "Card Height",
              },
              {
                label: "Image Width",
                key: "imageWidth",
                control: OptionSelect,
                options: ["8rem", "12rem", "16rem"],
                placeholder: "Image Width",
              },
              {
                label: "Image Height",
                key: "imageHeight",
                control: OptionSelect,
                options: ["8rem", "12rem", "16rem", "auto"],
                placeholder: "Image Height",
              },
            ],
          },
        },
      ],
    },
    {
      name: "Chart",
      icon: "ri-bar-chart-2-line",
      isCategory: true,
      children: [
        {
          name: "Bar Chart",
          _component: "@budibase/standard-components/bar",
          description: "Bar chart",
          icon: "ri-bar-chart-line",
          properties: {
            settings: [
              {
                label: "Title",
                key: "title",
                control: Input,
              },
              {
                label: "Data",
                key: "datasource",
                control: TableViewSelect,
              },
              {
                label: "Label Col.",
                key: "labelColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
              },
              {
                label: "Data Cols.",
                key: "valueColumns",
                dependsOn: "datasource",
                control: MultiTableViewFieldSelect,
              },
              {
                label: "Format",
                key: "yAxisUnits",
                control: OptionSelect,
                options: ["Default", "Thousands", "Millions"],
                defaultValue: "Default",
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
                label: "Width",
                key: "width",
                control: Input,
              },
              {
                label: "Height",
                key: "height",
                control: Input,
                defaultValue: "400",
              },
              {
                label: "Colours",
                key: "palette",
                control: OptionSelect,
                defaultValue: "Palette 1",
                options: [
                  "Palette 1",
                  "Palette 2",
                  "Palette 3",
                  "Palette 4",
                  "Palette 5",
                  "Palette 6",
                  "Palette 7",
                  "Palette 8",
                  "Palette 9",
                  "Palette 10",
                ],
              },
              {
                label: "Stacked",
                key: "stacked",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: false,
              },
              {
                label: "Data Labels",
                key: "dataLabels",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: false,
              },
              {
                label: "Animate",
                key: "animate",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: true,
              },
              {
                label: "Legend",
                key: "legend",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: false,
              },
            ],
          },
        },
        {
          name: "Line Chart",
          _component: "@budibase/standard-components/line",
          description: "Line chart",
          icon: "ri-line-chart-line",
          properties: {
            settings: [
              {
                label: "Title",
                key: "title",
                control: Input,
              },
              {
                label: "Data",
                key: "datasource",
                control: TableViewSelect,
              },
              {
                label: "Label Col.",
                key: "labelColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
              },
              {
                label: "Data Cols.",
                key: "valueColumns",
                dependsOn: "datasource",
                control: MultiTableViewFieldSelect,
              },
              {
                label: "Format",
                key: "yAxisUnits",
                control: OptionSelect,
                options: ["Default", "Thousands", "Millions"],
                defaultValue: "Default",
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
                label: "Width",
                key: "width",
                control: Input,
              },
              {
                label: "Height",
                key: "height",
                control: Input,
                defaultValue: "400",
              },
              {
                label: "Curve",
                key: "curve",
                control: OptionSelect,
                options: ["Smooth", "Straight", "Stepline"],
                defaultValue: "Smooth",
              },
              {
                label: "Colours",
                key: "palette",
                control: OptionSelect,
                defaultValue: "Palette 1",
                options: [
                  "Palette 1",
                  "Palette 2",
                  "Palette 3",
                  "Palette 4",
                  "Palette 5",
                  "Palette 6",
                  "Palette 7",
                  "Palette 8",
                  "Palette 9",
                  "Palette 10",
                ],
              },
              {
                label: "Data Labels",
                key: "dataLabels",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: false,
              },
              {
                label: "Animate",
                key: "animate",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: true,
              },
              {
                label: "Legend",
                key: "legend",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: false,
              },
            ],
          },
        },
        {
          name: "Area Chart",
          _component: "@budibase/standard-components/area",
          description: "Line chart",
          icon: "ri-line-chart-fill",
          properties: {
            settings: [
              {
                label: "Title",
                key: "title",
                control: Input,
              },
              {
                label: "Data",
                key: "datasource",
                control: TableViewSelect,
              },
              {
                label: "Label Col.",
                key: "labelColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
              },
              {
                label: "Data Cols.",
                key: "valueColumns",
                dependsOn: "datasource",
                control: MultiTableViewFieldSelect,
              },
              {
                label: "Format",
                key: "yAxisUnits",
                control: OptionSelect,
                options: ["Default", "Thousands", "Millions"],
                defaultValue: "Default",
              },
              {
                label: "Y Label",
                key: "yAxisLabel",
                control: Input,
              },
              {
                label: "X Label",
                key: "xAxisLabel",
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
                defaultValue: "400",
              },
              {
                label: "Curve",
                key: "curve",
                control: OptionSelect,
                options: ["Smooth", "Straight", "Stepline"],
                defaultValue: "Smooth",
              },
              {
                label: "Colours",
                key: "palette",
                control: OptionSelect,
                defaultValue: "Palette 1",
                options: [
                  "Palette 1",
                  "Palette 2",
                  "Palette 3",
                  "Palette 4",
                  "Palette 5",
                  "Palette 6",
                  "Palette 7",
                  "Palette 8",
                  "Palette 9",
                  "Palette 10",
                ],
              },
              {
                label: "Data Labels",
                key: "dataLabels",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: false,
              },
              {
                label: "Animate",
                key: "animate",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: true,
              },
              {
                label: "Legend",
                key: "legend",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: false,
              },
              {
                label: "Stacked",
                key: "stacked",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: true,
              },
              {
                label: "Gradient",
                key: "gradient",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: false,
              },
            ],
          },
        },
        {
          name: "Pie Chart",
          _component: "@budibase/standard-components/pie",
          description: "Pie chart",
          icon: "ri-pie-chart-line",
          properties: {
            settings: [
              {
                label: "Title",
                key: "title",
                control: Input,
              },
              {
                label: "Data",
                key: "datasource",
                control: TableViewSelect,
              },
              {
                label: "Label Col.",
                key: "labelColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
              },
              {
                label: "Data Col.",
                key: "valueColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
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
                defaultValue: "200",
              },
              {
                label: "Colours",
                key: "palette",
                control: OptionSelect,
                defaultValue: "Palette 1",
                options: [
                  "Palette 1",
                  "Palette 2",
                  "Palette 3",
                  "Palette 4",
                  "Palette 5",
                  "Palette 6",
                  "Palette 7",
                  "Palette 8",
                  "Palette 9",
                  "Palette 10",
                ],
              },
              {
                label: "Data Labels",
                key: "dataLabels",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: false,
              },
              {
                label: "Animate",
                key: "animate",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: true,
              },
              {
                label: "Legend",
                key: "legend",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: true,
              },
            ],
          },
        },
        {
          name: "Donut Chart",
          _component: "@budibase/standard-components/donut",
          description: "Donut chart",
          icon: "ri-donut-chart-line",
          properties: {
            settings: [
              {
                label: "Title",
                key: "title",
                control: Input,
              },
              {
                label: "Data",
                key: "datasource",
                control: TableViewSelect,
              },
              {
                label: "Label Col.",
                key: "labelColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
              },
              {
                label: "Data Col.",
                key: "valueColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
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
                defaultValue: "200",
              },
              {
                label: "Colours",
                key: "palette",
                control: OptionSelect,
                defaultValue: "Palette 1",
                options: [
                  "Palette 1",
                  "Palette 2",
                  "Palette 3",
                  "Palette 4",
                  "Palette 5",
                  "Palette 6",
                  "Palette 7",
                  "Palette 8",
                  "Palette 9",
                  "Palette 10",
                ],
              },
              {
                label: "Data Labels",
                key: "dataLabels",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: false,
              },
              {
                label: "Animate",
                key: "animate",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: true,
              },
              {
                label: "Legend",
                key: "legend",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: true,
              },
            ],
          },
        },
        {
          name: "Candlestick Chart",
          _component: "@budibase/standard-components/candlestick",
          description: "Candlestick chart",
          icon: "ri-stock-line",
          properties: {
            settings: [
              {
                label: "Title",
                key: "title",
                control: Input,
              },
              {
                label: "Data",
                key: "datasource",
                control: TableViewSelect,
              },
              {
                label: "Date Col.",
                key: "dateColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
              },
              {
                label: "Open Col.",
                key: "openColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
              },
              {
                label: "Close Col.",
                key: "closeColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
              },
              {
                label: "High Col.",
                key: "highColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
              },
              {
                label: "Low Col.",
                key: "lowColumn",
                dependsOn: "datasource",
                control: TableViewFieldSelect,
              },
              {
                label: "Format",
                key: "yAxisUnits",
                control: OptionSelect,
                options: ["Default", "Thousands", "Millions"],
                defaultValue: "Default",
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
                label: "Width",
                key: "width",
                control: Input,
              },
              {
                label: "Height",
                key: "height",
                control: Input,
                defaultValue: "400",
              },
              {
                label: "Animate",
                key: "animate",
                control: Checkbox,
                valueKey: "checked",
                defaultValue: true,
              },
            ],
          },
        },
      ],
    },
    {
      name: "Elements",
      icon: "ri-paragraph",
      isCategory: true,
      children: [
        {
          _component: "@budibase/standard-components/heading",
          name: "Headline",
          icon: "ri-heading",
          description: "A component for displaying heading text",
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
              { label: "Url", key: "url", control: ScreenSelect },
              {
                label: "New Tab",
                key: "openInNewTab",
                valueKey: "checked",
                control: Checkbox,
              },
            ],
          },
        },
        {
          _component: "@budibase/standard-components/icon",
          name: "Icon",
          description: "A basic component for displaying icons",
          icon: "ri-sun-fill",
          children: [],
          properties: {
            design: {},
            settings: [
              { label: "Icon", key: "icon", control: IconSelect },
              {
                label: "Size",
                key: "size",
                control: OptionSelect,
                defaultValue: "fa-lg",
                options: [
                  { value: "fa-xs", label: "xs" },
                  { value: "fa-sm", label: "sm" },
                  { value: "fa-lg", label: "lg" },
                  { value: "fa-2x", label: "2x" },
                  { value: "fa-3x", label: "3x" },
                  { value: "fa-5x", label: "5x" },
                  { value: "fa-7x", label: "7x" },
                  { value: "fa-10x", label: "10x" },
                ],
              },
              {
                label: "Color",
                key: "color",
                control: Colorpicker,
                defaultValue: "#000",
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
      ],
    },
    {
      name: "Other",
      icon: "ri-more-2-line",
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
            settings: [{ label: "Logo URL", key: "logoUrl", control: Input }],
          },
        },
        {
          name: "Login",
          _component: "@budibase/standard-components/login",
          description:
            "A component that automatically generates a login screen for your app.",
          icon: "ri-login-box-line",
          children: [],
          showOnPages: ["unauthenticated"],
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
        {
          name: "Row Detail",
          _component: "@budibase/standard-components/rowdetail",
          description:
            "Loads a row, using an id from the URL, which can be used with {{ context }}, in children",
          icon: "ri-profile-line",
          properties: {
            design: { ...all },
            settings: [{ label: "Table", key: "table", control: TableSelect }],
          },
          children: [],
        },
        {
          name: "New Row",
          _component: "@budibase/standard-components/newrow",
          description:
            "Sets up a new row for creation, which can be used with {{ context }}, in children",
          icon: "ri-profile-line",
          properties: {
            design: { ...all },
            settings: [{ label: "Table", key: "table", control: TableSelect }],
          },
          children: [],
        },
      ],
    },
  ],
}
