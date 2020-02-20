import indexDatatable from "../Templates/indexDatatable"

const templateOptions = {
  indexes: [
    {
      name: "customers",
    },
  ],
  helpers: {
    indexSchema: index => {
      const field = name => ({ name })
      if (index.name === "customers")
        return [
          field("id"),
          field("surname"),
          field("forname"),
          field("address"),
        ]
    },
  },
}

export const props = {
  H1: {
    _component: "@budibase/materialdesign-components/H1",
    _children: [],
    text: "Im a big header",
  },
  Overline: {
    _component: "@budibase/materialdesign-components/Overline",
    _children: [],
    text: "Im a wee overline",
  },
  Button: {
    _component: "@budibase/materialdesign-components/Button",
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
    onClick: () => alert`Button Clicked`,
  },
  Icon: {
    _component: "@budibase/materialdesign-components/Icon",
    _children: [],
    icon: "",
  },
  Textfield: {
    _component: "@budibase/materialdesign-components/Textfield",
    _children: [],
    label: "First",
    colour: "secondary",
    fullwidth: true,
    maxLength: 500,
    helperText: "Add Surname",
    onChange: text => console.log("Text: ", text),
  },
  Checkbox: {
    _component: "@budibase/materialdesign-components/Checkbox",
    _children: [],
    id: "test-check",
    label: "Check Yo Self",
    onClick: () => alert`Before ya reck yo'self`,
  },
  Checkboxgroup: {
    _component: "@budibase/materialdesign-components/Checkboxgroup",
    _children: [],
    label: "Whats your favourite?",
    items: [
      { label: "Currys", indeterminate: true },
      { label: "Chips", checked: true },
      { label: "Pasties" },
    ],
    onChange: selectedItems => console.log(selectedItems),
  },
  Radiobutton: {
    _component: "@budibase/materialdesign-components/Radiobutton",
    _children: [],
    label: "Hi radio",
    alignEnd: true,
    onClick: () => alert`Roger That`,
  },
  Radiobuttongroup: {
    _component: "@budibase/materialdesign-components/Radiobuttongroup",
    _children: [],
    label: "Preferred method of contact: ",
    orientation: "column",
    items: [
      { label: "Email", value: 1 },
      { label: "Phone", value: 2 },
      { label: "Social Media", value: 3 },
    ],
    onChange: selected => console.log(selected),
  },
  Datatable: {
    _component: "@budibase/materialdesign-components/Datatable",
    _children: [],
  },

  CustomersIndexTable: indexDatatable(templateOptions)[0].props,
}
