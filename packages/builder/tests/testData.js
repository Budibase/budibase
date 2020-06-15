export const componentsAndScreens = () => ({
  components: [
    {
      _instanceName: "TextBox",
      tags: ["Text", "input"],
      children: false,
      props: {
        size: { type: "options", options: ["small", "medium", "large"] },
        isPassword: "bool",
        placeholder: "string",
        label: "string",
      },
    },
    {
      _instanceName: "Button",
      tags: ["input"],
      children: true,
      props: {
        size: { type: "options", options: ["small", "medium", "large"] },
        css: "string",
        contentText: "string",
      },
    },
    {
      _instanceName: "div",
      tags: ["input"],
      props: {
        width: "number",
      },
    },
    {
      _instanceName: "Record View",
      tags: ["record"],
      props: {
        data: "state",
      },
    },
  ],
  screens: [
    {
      props: {
        _component: "budibase-components/TextBox",
        _instanceName: "SmallTextbox",
        size: "small",
      },
    },

    {
      name: "common/PasswordBox",
      tags: ["mask"],
      props: {
        _component: "budibase-components/TextBox",
        _instanceName: "PasswordBox",
        isPassword: true,
        size: "small",
      },
    },

    {
      props: {
        _component: "budibase-components/Button",
        _instanceName: "PrimaryButton",
        css: "btn-primary",
      },
    },

    {      
      route: "",
      props: {
        _component: "budibase-components/div",
        width: 100,
        _instanceName: "Screen 1",
        _children: [
          {
            _component: "budibase-components/Button",
            contentText: "Button 1",
            _instanceName: "Button 1",
          },
          {
            _component: "budibase-components/Button",
            contentText: "Button 2",
            _instanceName: "Button 2",
          },
          {
            _component: "budibase-components/TextBox",
            _instanceName: "TextBox",
            isPassword: true,
            size: "small",
          },
        ],
      },
    },

    {
      props: {
        _component: "budibase-components/div",
        _instanceName: "Field",
        _children: [
          {
            _component: "common/SmallTextbox",
          },
        ],
      },
    },
  ],
})

export const stripStandardProps = props => {
  delete props._code
  delete props._id
  delete props._styles
}
