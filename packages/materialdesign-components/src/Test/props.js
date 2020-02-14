
export const props = {
  h1: {
    _component: "@budibase/materialdesign-components/H1",
    _children: [],
    text: "Im a big header",
  },
  overline: {
    _component: "@budibase/materialdesign-components/Overline",
    _children: [],
    text: "Im a wee overline",
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
    disabled: false,
  },
  icon: {
    _component: "@budibase/materialdesign-components/icon",
    _children: [],
    icon: "",
  },
  textfield: {
    _component: "@budibase/materialdesign-components/textfield",
    _children: [],
    label: "First",
    colour: "secondary",
    textarea: true,
    fullwidth: true,
    helperText: "Add Surname",
    useCharCounter: true,
  },
  checkbox: {
    _component: "@budibase/materialdesign-components/checkbox",
    _children: [],
    id: "test-check",
    label: "Check Yo Self",
    onClick: () => alert`Before ya reck yo'self`,
  },
  checkboxgroup: {
    _component: "@budibase/materialdesign-components/checkboxgroup",
    _children: [],
    label: "Whats your favourite?",
    items: [
      { label: "Currys", indeterminate: true },
      { label: "Chips", checked: true },
      { label: "Pasties" },
    ],
    onChange: selectedItems => console.log(selectedItems),
  },
  radiobutton: {
    _component: "@budibase/materialdesign-components/radiobutton",
    _children: [],
    label: "Hi radio",
    alignEnd: true,
    onClick: () => alert`Roger That`,
  },
  radiobuttongroup: {
    _component: "@budibase/materialdesign-components/radiobuttongroup",
    _children: [],
    label: "Preferred method of contact: ",
    orientation: "column",
    items: [
      { label: "Email", value: 1 },
      { label: "Phone", value: 2 },
      { label: "Social Media", value: 3 },
    ],
    onChange: selected => console.log(selected),
  }
}
