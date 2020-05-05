import { general, layout, background } from "./propertyCategories.js"

export default {
  categories: [
    {
      name: 'Basic',
      isCategory: true,
      children: [
        {
          _component: "@budibase/standard-components/container",
          name: 'Container',
          description: 'This component contains things within itself',
          icon: 'ri-layout-row-fill',
          commonProps: {},
          children: [],
          properties: { background },
        },
        {
          name: 'Text',
          description: 'This is a simple text component',
          icon: 'ri-t-box-fill',
          commonProps: {},
          children: [
            {
              _component: '@budibase/standard-components/heading',
              name: 'Headline',
              description: "A component for displaying heading text",
              icon: "ri-heading",
              properties: {
                general,
                layout,
                background,
              },
            },
            {
              _component: '@budibase/standard-components/text',
              name: 'Paragraph',
              description: "A component for displaying paragraph text.",
              icon: 'ri-paragraph',
              properties: {}
            }
          ]
        },
        {
          name: 'Input',
          description: "These components handle user input.",
          icon: 'ri-edit-box-line',
          commonProps: {},
          children: [
            {
              _component: "@budibase/standard-components/textfield",
              name: "Textfield",
              description: "A textfield component that allows the user to input text.",
              icon: 'ri-edit-box-line',
              properties: {}
            },
            {
              _component: "@budibase/standard-components/checkbox",
              name: "Checkbox",
              description: "A selectable checkbox component",
              icon: 'ri-checkbox-line',
              properties: {}
            },
            {
              _component: "@budibase/standard-components/radiobutton",
              name: "Radiobutton",
              description: "A selectable radiobutton component",
              icon: 'ri-radio-button-line',
              properties: {}
            },
            {
              _component: "@budibase/standard-components/select",
              name: "Select",
              description: "A select component for choosing from different options",
              icon: 'ri-file-list-line',
              properties: {}
            }
          ]
        },
        {
          _component: "@budibase/standard-components/button",
          name: 'Button',
          description: 'A basic html button that is ready for styling',
          icon: 'ri-radio-button-fill',
          children: [],
          properties: {},
        },
        {
          _component: "@budibase/standard-components/icon",
          name: 'Icon',
          description: 'A basic component for displaying icons',
          icon: 'ri-sun-fill',
          properties: {},
          children: []
        },
        {
          _component: "@budibase/standard-components/link",
          name: 'Link',
          description: 'A basic link component for internal and external links',
          icon: 'ri-link',
          properties: {},
          children: []
        }
      ]
    },
    {
      name: 'Blocks',
      isCategory: true,
      children: [
        {
          _component: "@budibase/materialdesign-components/BasicCard",
          name: 'Card',
          description: 'A basic card component that can contain content and actions.',
          icon: 'ri-layout-bottom-line',
          properties: {},
          children: []
        },
        {
          name: 'Login',
          description: 'A component that automatically generates a login screen for your app.',
          icon: 'ri-login-box-fill',
          properties: {},
          children: []
        },
        {
          name: "Navigation Bar",
          _component: "@budibase/standard-components/Navigation",
          description: "A component for handling the navigation within your app.",
          icon: "ri-navigation-fill",
          properties: {},
          children: []
        }
      ]
    },
    {
      name: 'Data',
      isCategory: true,
      children: [
        {
          name: 'Table',
          description: 'A component that generates a table from your data.',
          icon: 'ri-archive-drawer-fill',
          properties: {},
          children: []
        },
        {
          name: 'Form',
          description: 'A component that generates a form from your data.',
          icon: 'ri-file-edit-fill',
          properties: {},
          _component: "@budibase/materialdesign-components/Form",
          template: {
            component: "@budibase/materialdesign-components/Form",
            description: "Form for saving a record",
            name: "@budibase/materialdesign-components/recordForm",
          },
          children: []
        }
      ]
    },
  ]
}