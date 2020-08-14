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
                placeholder: "/table/{{context._id}}",
              },
            ],
          },
        },
        {
          name: "Card",
          description: "Card components",
          icon: "ri-layout-bottom-line",
          commonProps: {},
          children: [
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
                    control: Input,
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
                    control: Input,
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
          name: "Donut Chart",
          _component: "@budibase/standard-components/donut",
          description: "Donut chart",
          icon: "ri-pie-chart-line",
          properties: {
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
                label: "Hover Highlight",
                key: "hasHoverAnimation",
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
                label: "Name Field",
                key: "nameKey",
                control: Input,
              },
              {
                label: "Value Field",
                key: "valueKey",
                control: Input,
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
          children: [],
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
