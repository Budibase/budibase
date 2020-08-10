import Input from "../common/Input.svelte"
import OptionSelect from "./OptionSelect.svelte"
import Checkbox from "../common/Checkbox.svelte"
import ModelSelect from "components/userInterface/ModelSelect.svelte"
import Event from "components/userInterface/EventsEditor/EventPropertyControl.svelte"

import { all } from "./propertyCategories.js"

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
              { label: "onClick", key: "onClick", control: Event },
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
          name: "Chart",
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
