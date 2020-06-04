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
      _instanceName: "budibase-components/Button",
      tags: ["input"],
      children: true,
      props: {
        size: { type: "options", options: ["small", "medium", "large"] },
        css: "string",
        contentText: "string",
      },
    },
    {
      _instanceName: "budibase-components/div",
      tags: ["input"],
      props: {
        width: "number",
      },
    },
    {
      _instanceName: "budibase-components/RecordView",
      tags: ["record"],
      props: {
        data: "state",
      },
    },
  ],
  screens: [
    {
      props: {
        _instanceName: "Container",
        _component: "budibase-components/TextBox",
        size: "small",
      },
    },

    {
      tags: ["mask"],
      props: {
        _instanceName: "common/PasswordBox",
        _component: "budibase-components/TextBox",
        isPassword: true,
        size: "small",
      },
    },

    {
      props: {
        _instanceName: "PrimaryButton",
        _component: "budibase-components/Button",
        css: "btn-primary",
      },
    },

    {
      route: "",
      props: {
        _instanceName: "Screen 1",
        _component: "budibase-components/div",
        width: 100,
        _children: [
          {
            _component: "budibase-components/Button",
            contentText: "Button 1",
          },
          {
            _component: "budibase-components/Button",
            contentText: "Button 2",
          },
          {
            _component: "budibase-components/TextBox",
            isPassword: true,
            size: "small",
          },
        ],
      },
    },

    {
      props: {
        _instanceName: "Field",
        _component: "budibase-components/div",
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
