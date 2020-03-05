import indexDatatable from "../Templates/indexDatatable"

const templateOptions = {
  indexes: [
    {
      name: "customers",
      nodeKey: () => "/customers"
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
    onClick: [
      {
        "##eventHandlerType": "Set State",
        parameters: {
          path: "surname",
          value: "hi",
        },
      },
    ],
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
    value: "store.surname",
  },
  BodyBoundToStore: {
    _component: "@budibase/materialdesign-components/Body1",
    text: "store.surname",
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
    label: "Whats your favourite?",
    onChange: selectedItems => console.log(selectedItems),
    _children: [
      {
        _component: "@budibase/materialdesign-components/Checkbox",
        _children: [],
        label: "Currys",
        indeterminate: true,
      },
      {
        _component: "@budibase/materialdesign-components/Checkbox",
        _children: [],
        label: "Chips",
      },
      {
        _component: "@budibase/materialdesign-components/Checkbox",
        _children: [],
        label: "Pasties",
      },
    ],
  },
  Radiobutton: {
    _component: "@budibase/materialdesign-components/Radiobutton",
    _children: [],
    label: "Hi radio",
    alignEnd: true,
    onClick: item => console.log(item),
  },
  Radiobuttongroup: {
    _component: "@budibase/materialdesign-components/Radiobuttongroup",
    label: "Preferred method of contact: ",
    orientation: "column",
    onChange: selected => console.log("Radiobutton Group", selected),
    _children: [
      {
        _component: "@budibase/materialdesign-components/Radiobutton",
        _children: [],
        label: "Email",
        value: 1,
      },
      {
        _component: "@budibase/materialdesign-components/Radiobutton",
        _children: [],
        label: "Phone",
        value: 2,
      },
      {
        _component: "@budibase/materialdesign-components/Radiobutton",
        _children: [],
        label: "Social Media",
        value: 3,
      },
    ],
  },
  Datatable: {
    _component: "@budibase/materialdesign-components/Datatable",
    _children: [],
  },

  CustomersIndexTable: indexDatatable(templateOptions)[0].props,
  List: {
    _component: "@budibase/materialdesign-components/List",
    variant: "two-line",
    singleSelection: false,
    onSelect: selected => console.log("LIST SELECT", selected),
    _children: [
      {
        _component: "@budibase/materialdesign-components/ListItem",
        _children: [],
        text: "Curry",
        secondaryText: "Chicken or Beef",
        value: 0,
        divider: true,
      },
      {
        _component: "@budibase/materialdesign-components/ListItem",
        _children: [],
        text: "Pastie",
        secondaryText: "Bap with Mayo",
        value: 1,
        disabled: true,
      },
      {
        _component: "@budibase/materialdesign-components/ListItem",
        _children: [],
        text: "Fish",
        secondaryText: "Salmon or Cod",
        value: 2,
      },
    ],
  },
  Select: {
    _component: "@budibase/materialdesign-components/Select",
    label: "Choose a Milkshake",
    helperText: "Choose a flavour",
    persistent: true,
    value: "1",
    onSelect: selectedItem => console.log("SELECT ITEM", selectedItem),
    _children: [
      {
        _component: "@budibase/materialdesign-components/ListItem",
        _children: [],
        text: "Orange",
        value: "0",
      },
      {
        _component: "@budibase/materialdesign-components/ListItem",
        _children: [],
        text: "Apple",
        value: "1",
      },
      {
        _component: "@budibase/materialdesign-components/ListItem",
        _children: [],
        text: "Berry",
        value: "2",
      },
    ],
  }
}
