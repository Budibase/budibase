import Input from "../common/Input.svelte"
import OptionSelect from "./OptionSelect.svelte"
import Checkbox from "../common/Checkbox.svelte"
import ModelSelect from "components/userInterface/ModelSelect.svelte"

import { all } from "./propertyCategories.js"

export default {
  categories: [
    {
      name: "Basic",
      isCategory: true,
      children: [
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
          _component: "@budibase/standard-components/container",
          name: "Container",
          description: "This component contains things within itself",
          icon: "ri-layout-row-fill",
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
                  { label: "article" },
                  { label: "aside" },
                  { label: "details" },
                  { label: "div" },
                  { label: "figure" },
                  { label: "figcaption" },
                  { label: "footer" },
                  { label: "header" },
                  { label: "main" },
                  { label: "mark" },
                  { label: "nav" },
                  { label: "paragraph" },
                  { label: "summary" },
                ],
              },
            ],
          },
        },
        {
          name: "Text",
          description: "This is a simple text component",
          icon: "ri-t-box-fill",
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
          icon: "ri-edit-box-fill",
          commonProps: {},
          children: [
            {
              _component: "@budibase/standard-components/input",
              name: "Textfield",
              description:
                "A textfield component that allows the user to input text.",
              icon: "ri-edit-box-fill",
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
              icon: "ri-checkbox-fill",
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
              icon: "ri-file-list-fill",
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
          icon: "ri-radio-button-fill",
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
          icon: "ri-image-fill",
          children: [],
          properties: {
            design: { ...all },
            settings: [{ label: "URL", key: "url", control: Input }],
          },
        },
        {
          _component: "@budibase/standard-components/icon",
          name: "Icon",
          description: "A basic component for displaying icons",
          icon: "ri-sun-fill",
          children: [],
          properties: {
            design: { ...all },
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
          _component: "@budibase/materialdesign-components/BasicCard",
          name: "Card",
          description:
            "A basic card component that can contain content and actions.",
          icon: "ri-layout-bottom-fill",
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
          name: "Login",
          _component: "@budibase/standard-components/login",
          description:
            "A component that automatically generates a login screen for your app.",
          icon: "ri-login-box-fill",
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
            ],
          },
        },
        {
          name: "Table",
          _component: "@budibase/standard-components/datatable",
          description: "A component that generates a table from your data.",
          icon: "ri-archive-drawer-fill",
          properties: {
            design: { ...all },
            settings: [{ label: "Model", key: "model", control: ModelSelect }],
          },
          children: [],
        },
        {
          name: "Form",
          description: "A component that generates a form from your data.",
          icon: "ri-file-edit-fill",
          properties: {
            design: { ...all },
            settings: [{ label: "Model", key: "model", control: ModelSelect }],
          },
          _component: "@budibase/standard-components/dataform",
          template: {
            component: "@budibase/materialdesign-components/Form",
            description: "Form for saving a record",
            name: "@budibase/materialdesign-components/recordForm",
          },
          children: [],
        },
        {
          name: "Chart",
          _component: "@budibase/standard-components/datachart",
          description: "Shiny chart",
          icon: "ri-bar-chart-fill",
          properties: {
            design: { ...all },
            settings: [
              { label: "Model", key: "model", control: ModelSelect },
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
          name: "Data List",
          _component: "@budibase/standard-components/datalist",
          description: "Shiny list",
          icon: "ri-file-list-fill",
          properties: {
            design: { ...all },
            settings: [{ label: "Model", key: "model", control: ModelSelect }],
          },
          children: [],
        },
        {
          name: "List",
          _component: "@budibase/standard-components/list",
          description: "Shiny list",
          icon: "ri-file-list-fill",
          properties: {
            design: { ...all },
            settings: [{ label: "Model", key: "model", control: ModelSelect }],
          },
          children: [],
        },
        {
          name: "Map",
          _component: "@budibase/standard-components/datamap",
          description: "Shiny map",
          icon: "ri-map-pin-fill",
          properties: { design: { ...all } },
          children: [],
        },
      ],
    },
    {
      name: "Layouts",
      isCategory: true,
      children: [
        {
          _component: "##builtin/screenslot",
          name: "Screenslot",
          description:
            "This component is a placeholder for the rendering of a screen within a page.",
          icon: "ri-crop-2-fill",
          properties: { design: { ...all } },
          commonProps: {},
          children: [],
        },
        {
          name: "Nav Bar",
          _component: "@budibase/standard-components/Navigation",
          description:
            "A component for handling the navigation within your app.",
          icon: "ri-navigation-fill",
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
      ],
    },
  ],
}
