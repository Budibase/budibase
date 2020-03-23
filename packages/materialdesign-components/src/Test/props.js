import indexDatatable from "../Templates/indexDatatable"

const templateOptions = {
  indexes: [
    {
      name: "customers",
      nodeKey: () => "/customers",
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
    alignEnd: true,
    label: "Check Yo Self",
    onClick: () => alert`Before ya reck yo'self`,
  },
  Checkboxgroup: {
    _component: "@budibase/materialdesign-components/Checkboxgroup",
    label: "Whats your favourite?",
    disabled: true,
    alignEnd: true,
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
    disabled: true,
    alignEnd: true,
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
  },
  DatePicker: {
    _component: "@budibase/materialdesign-components/DatePicker",
    _children: [],
    label: "Date of Admission",
    onSelect: date => console.log("SELECTED DATE", date),
  },
  IconButton: {
    _component: "@budibase/materialdesign-components/IconButton",
    _children: [],
    icon: "calendar_today",
  },
  Card: {
    _id: "card",
    width: "400",
    _component: "@budibase/materialdesign-components/Card",
    _children: [
      {
        _id: "cardbody",
        _component: "@budibase/materialdesign-components/CardBody",
        onClick: () => alert`Hi`,
        _children: [
          {
            _id: "cardimage1",
            _component: "@budibase/materialdesign-components/CardImage",
            _children: [],
            displayHorizontal: true,
            url: "https://picsum.photos/350",
            title: "Our New World",
            subtitle: "Out now in cinemas",
          },
        ],
      },
      {
        _component: "@budibase/materialdesign-components/CardFooter",
        _children: [
          {
            _component: "@budibase/materialdesign-components/Button",
            text: "Save",
          },
          {
            _component: "@budibase/materialdesign-components/Button",
            text: "Cancel",
          },
          {
            _component: "@budibase/materialdesign-components/IconButton",
            icon: "3d_rotation",
          },
          {
            _component: "@budibase/materialdesign-components/IconButton",
            icon: "accessibility",
          },
          {
            _component: "@budibase/materialdesign-components/IconButton",
            icon: "alarm_on",
          },
        ],
      },
    ],
  },
  Dialog: {
    _component: "@budibase/materialdesign-components/Dialog",
    _children: [
      {
        _component: "@budibase/materialdesign-components/DialogHeader",
        title: "Important Message",
        _children: [],
      },
      {
        _component: "@budibase/materialdesign-components/DialogContent",
        _children: [
          {
            _component: "@budibase/materialdesign-components/H3",
            text: "An announcement from your service provider",
            _children: [],
          },
          {
            _component: "@budibase/materialdesign-components/Body2",
            text:
              "All non-essential services will be shut down as of tomorrow. Please acknowledge that you have seen this message by confirming below.",
            _children: [],
          },
        ],
      },
      {
        _component: "@budibase/materialdesign-components/DialogActions",
        _children: [
          {
            _component: "@budibase/materialdesign-components/Button",
            text: "Confirm",
            variant: "unelevated",
            _children: [],
          },
          {
            _component: "@budibase/materialdesign-components/Button",
            text: "Cancel",
            _children: [],
          },
        ],
      },
    ],
  },
}
