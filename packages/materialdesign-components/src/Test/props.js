const getComponent = comp => `@budibase/materialdesign-components/${comp}`;


export const props = {
  h1: {
    _component: "@budibase/materialdesign-components/H1",
    _children: [],
    text: "Im a big header",
  },
  overline: {
    _component: getComponent`Overline`,
    _children: [],
    text: "A wee Overline",
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
    label: "First",
    colour: "secondary",
    textarea: true,
    fullwidth:true,
    helperText: "Add Surname",
    useCharCounter: true
  }
};

