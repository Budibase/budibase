export default {
  categories: [
    {
      name: 'Basic',
      isCategory: true,
      children: [
        {
          name: 'Container',
          description: 'This component contains things within itself',
          icon: 'ri-layout-row-fill',
          commonProps: {},
          children: []
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
              icon: 'headline',
              props: {
                type: {
                  type: 'options',
                  options: [
                    'h1',
                    'h2'
                  ],
                  'default': 'h1'
                }
              }
            },
            {
              _component: '@budibase/standard-components/text',
              name: 'Paragraph',
              icon: 'paragraph',
              props: {}
            }
          ]
        },
        {
          name: 'Button',
          description: 'A basic html button that is ready for styling',
          icon: 'ri-radio-button-fill',
          commonProps: {},
          children: []
        },
        {
          name: 'Icon',
          description: 'A basic component for displaying icons',
          icon: 'ri-sun-fill',
          commonProps: {},
          children: []
        },
        {
          name: 'Avatar',
          description: 'A basic component for rendering an avatar',
          icon: 'ri-user-smile-fill',
          commonProps: {},
          children: []
        },
        {
          name: 'Link',
          description: 'A basic link component for internal and external links',
          icon: 'ri-link',
          commonProps: {},
          children: []
        }
      ]
    },
    {
      name: 'Form',
      isCategory: true,
      children: [
        {
          name: 'Button',
          description: 'A basic html button that is ready for styling',
          icon: 'ri-radio-button-fill',
          commonProps: {},
          children: []
        },
        {
          name: 'Icon',
          description: 'A basic component for displaying icons',
          icon: 'ri-sun-fill',
          commonProps: {},
          children: []
        },
        {
          name: 'Avatar',
          description: 'A basic component for rendering an avatar',
          icon: 'ri-user-smile-fill',
          commonProps: {},
          children: []
        },
        {
          name: 'Link',
          description: 'A basic link component for internal and external links',
          icon: 'ri-link',
          commonProps: {},
          children: []
        }
      ]
    },
    {
      name: 'Blocks',
      isCategory: true,
      children: [
        {
          name: 'Card',
          description: 'A basic card component that can contain content and actions.',
          icon: 'ri-layout-bottom-line',
          commonProps: {},
          children: []
        },
        {
          name: 'Login',
          description: 'A component that automatically generates a login screen for your app.',
          icon: 'ri-login-box-fill',
          commonProps: {},
          children: []
        },
        {
          name: 'Navbar',
          description: 'A component for handling the navigation within your app.',
          icon: 'ri-navigation-fill',
          commonProps: {},
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
          commonProps: {},
          children: []
        },
        {
          name: 'Form',
          description: 'A component that generates a form from your data.',
          icon: 'ri-file-edit-fill',
          commonProps: {},
          component: "@budibase/materialdesign-components/Form",
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