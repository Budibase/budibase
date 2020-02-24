export default ({ records }) =>
  records.map(r => ({
    name: `Form for Record: ${r.nodeKey()}`,
    props: outerContainer(r),
  }))

const outerContainer = record => ({
  _component: "@budibase/standard-components/container",
  _code: "",
  onLoad: [],
  type: "div",
  _children: [
    heading(record),
    ...record.fields.map(f => field(record, f)),
    buttons(record),
  ],
})

const heading = record => ({
  _component: "@budibase/materialdesign-components/H3",
  text: capitalize(record.name),
})

const field = (record, f) => {
  if (f.type === "bool") return checkbox(record, f)
  return textField(record, f)
}

const textField = (record, f) => ({
  _component: "@budibase/materialdesign-components/Textfield",
  label: f.label,
  variant: "filled",
  disabled: false,
  fullwidth: false,
  colour: "primary",
  maxLength: f.typeOptions && f.typeOptions.maxLength ? f.typeOptions.maxLength : 0,
  placeholder: f.label,
  value: fieldValueBinding(record, f),
})

const checkbox = (record, f) => ({
  _component: "@budibase/materialdesign-components/Checkbox",
  label: f.label,
  checked: fieldValueBinding(record, f),
})

const fieldValueBinding = (record, f) => `state.${record.name}.${f.name}`

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

const buttons = record => ({
  _component: "@budibase/standard-components/container",
  borderWidth: "1px 0px 0px 0px",
  borderColor: "lightgray",
  borderStyle: "solid",
  _styles: {
    position: {
      column: ["", ""],
      row: ["", ""],
      margin: ["","","",""],
      padding: ["30px","","",""],
      height: [""],
      width: [""],
      zindex: [""]
    },
    layout: {
      templaterows: [""],
      templatecolumns: [""]
    },
  },
  _children: [
    {
      _component: "@budibase/materialdesign-components/Button",
      onClick: [
        {
          "##eventHandlerType": "Save Record",
          parameters: {
            statePath: `${record.name}`,
          },
        },
        {
          "##eventHandlerType": "Navigate To",
          parameters: {
            url: `/${record.name}s`,
          },
        },
      ],
      variant: "raised",
      colour: "primary",
      size: "medium",
      text: `Save ${capitalize(record.name)}`,
    },
    {
      _component: "@budibase/materialdesign-components/Button",
      _styles: {
        position: {
          row: ["", ""],
          column: ["", ""],
          padding: ["", "", "", ""],
          margin: ["", "", "", "10px"],
          width: [""],
          height: [""],
          zindex: [""],
        },
        layout: {
          templatecolumns: [""],
          templaterows: [""],
        },
      },
      onClick: [
        {
          "##eventHandlerType": "Navigate To",
          parameters: {
            url: `/${record.name}s`,
          },
        },
      ],
      colour: "secondary",
      text: "Cancel",
    },
  ],
})
