const getComponent = comp => `@budibase//materialdesign-components/${comp}`;

export const props = {
  justAnH1: {
    _component: "@budibase/materialdesign-components/h1",
    _children: [],
    text: "This is a Header",
  },
  button: {
    _component: "@budibase/materialdesign-components/button",
    _children: [],
    variant: "raised",
    colour: "secondary",
    size: "large",
    href: "",
    icon: "alarm_on",
    trailingIcon: true,
    fullwidth: false,
    text: "I am button",
    disabled: false
  },
  icon: {
    _component: "@budibase/materialdesign-components/icon",
    _children: [],
    icon: ""
  },
  textfield: {
    _component: "@budibase/materialdesign-components/textfield",
    _children: [],
    label: "Surname",
    icon: "alarm_on",
    variant: "outlined",
    helperText: "Add Surname",
    textarea: true,
    useCharCounter: true
  }
};

