import Input from "../common/Input.svelte"

import { all } from "./propertyCategories.js"

export default {
  categories: [
    {
      name: "Basic",
      isCategory: true,
      children: [
        {
          _component: "##builtin/screenslot",
          name: "Screenslot",
          description:
            "This component is a placeholder for the rendering of a screen within a page.",
          icon: "ri-crop-2-line",
          commonProps: {},
          children: [],
        },
        {
          _component: "@budibase/standard-components/container",
          name: "Container",
          description: "This component contains things within itself",
          icon: "ri-layout-row-fill",
          commonProps: {},
          children: [],
          properties: { design: { ...all } },
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
                settings: {
                  text: {
                    control: Input,
                  },
                },
              },
            },
            {
              _component: "@budibase/standard-components/text",
              name: "Paragraph",
              description: "A component for displaying paragraph text.",
              icon: "ri-paragraph",
              properties: {
                design: { ...all },
                settings: {
                  text: {
                    control: Input,
                  },
                },
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
              properties: { design: { ...all } },
            },
            {
              _component: "@budibase/standard-components/checkbox",
              name: "Checkbox",
              description: "A selectable checkbox component",
              icon: "ri-checkbox-line",
              properties: { design: { ...all } },
            },
            {
              _component: "@budibase/standard-components/radiobutton",
              name: "Radiobutton",
              description: "A selectable radiobutton component",
              icon: "ri-radio-button-line",
              properties: { design: { ...all } },
            },
            {
              _component: "@budibase/standard-components/select",
              name: "Select",
              description:
                "A select component for choosing from different options",
              icon: "ri-file-list-line",
              properties: { design: { ...all } },
            },
          ],
        },
        {
          _component: "@budibase/standard-components/button",
          name: "Button",
          description: "A basic html button that is ready for styling",
          icon: "ri-radio-button-fill",
          children: [],
          properties: { design: { ...all } },
        },
        {
          _component: "@budibase/standard-components/icon",
          name: "Icon",
          description: "A basic component for displaying icons",
          icon: "ri-sun-fill",
          children: [],
          properties: { design: { ...all } },
        },
        {
          _component: "@budibase/standard-components/link",
          name: "Link",
          description: "A basic link component for internal and external links",
          icon: "ri-link",
          children: [],
          properties: { design: { ...all } },
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
          icon: "ri-layout-bottom-line",
          children: [],
          properties: { design: { ...all } },
        },
        {
          name: "Login",
          description:
            "A component that automatically generates a login screen for your app.",
          icon: "ri-login-box-fill",
          children: [],
          properties: { design: { ...all } },
        },
        {
          name: "Navigation Bar",
          _component: "@budibase/standard-components/Navigation",
          description:
            "A component for handling the navigation within your app.",
          icon: "ri-navigation-fill",
          children: [],
          properties: { design: { ...all } },
        },
      ],
    },
    {
      name: "Data",
      isCategory: true,
      children: [
        {
          name: "Table",
          description: "A component that generates a table from your data.",
          icon: "ri-archive-drawer-fill",
          properties: { design: { ...all } },
          children: [],
        },
        {
          name: "Form",
          description: "A component that generates a form from your data.",
          icon: "ri-file-edit-fill",
          properties: { design: { ...all } },
          _component: "@budibase/materialdesign-components/Form",
          template: {
            component: "@budibase/materialdesign-components/Form",
            description: "Form for saving a record",
            name: "@budibase/materialdesign-components/recordForm",
          },
          children: [],
        },
        {
          _component: "@budibase/standard-components/datatable",
          name: "DataTable",
          description: "A table for displaying data from the backend.",
          icon: "ri-archive-drawer-fill",
          properties: { design: { ...all } },
          children: [],
        },
        {
          _component: "@budibase/standard-components/dataform",
          name: "DataForm",
          description: "Form stuff",
          icon: "ri-file-edit-fill",
          properties: { design: { ...all } },
          children: [],
        },
        {
          name: "Chart",
          _component: "@budibase/standard-components/datachart",
          description: "Shiny chart",
          icon: "ri-bar-chart-line",
          properties: { design: { ...all } },
          children: [],
        },
        {
          name: "List",
          _component: "@budibase/standard-components/datalist",
          description: "Shiny list",
          icon: "ri-file-list-line",
          properties: { design: { ...all } },
          children: [],
        },
        {
          name: "Map",
          _component: "@budibase/standard-components/datamap",
          description: "Shiny map",
          icon: "ri-map-pin-line",
          properties: { design: { ...all } },
          children: [],
        },
      ],
    },
  ],
}