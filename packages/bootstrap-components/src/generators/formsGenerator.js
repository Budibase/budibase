import { buttons } from "./buttonGenerators"

export const forms = ({ records, indexes, helpers }) => [
  ...records.map(root),
  ...buttons({ records, indexes, helpers }),
]

export const formName = record => `${record.name}/${record.name} Form`

const root = record => ({
  name: formName(record),
  description: `Control for creating/updating '${record.nodeKey()}' `,
  inherits: "@budibase/standard-components/div",
  props: {
    className: "p-1",
    children: [
      {
        component: {
          _component: "@budibase/standard-components/h3",
          text: `Edit ${record.name}`,
        },
      },
      form(record),
      saveCancelButtons(record),
    ],
  },
})

const form = record => ({
  component: {
    _component: "@budibase/standard-components/form",
    formControls: record.fields.map(f => formControl(record, f)),
  },
})

const formControl = (record, field) => {
  if (
    field.type === "string" &&
    field.typeOptions.values &&
    field.typeOptions.values.length > 0
  ) {
    return {
      control: {
        _component: "@budibase/standard-components/select",
        options: field.typeOptions.values.map(v => ({ id: v, value: v })),
        value: {
          "##bbstate": `${record.name}.${field.name}`,
          "##bbsource": "store",
        },
        className: "form-control",
      },
      label: field.label,
    }
  } else {
    return {
      control: {
        _component: "@budibase/standard-components/input",
        value: {
          "##bbstate": `${record.name}.${field.name}`,
          "##bbsource": "store",
        },
        className: "form-control",
        type:
          field.type === "string"
            ? "text"
            : field.type === "datetime"
            ? "date"
            : field.type === "number"
            ? "number"
            : "text",
      },
      label: field.label,
    }
  }
}

const saveCancelButtons = record => ({
  component: {
    _component: "@budibase/standard-components/stackpanel",
    direction: "horizontal",
    children: [
      paddedPanelForButton({
        _component: "common/Primary Button",
        contentText: `Save ${record.name}`,
        onClick: [
          {
            "##eventHandlerType": "Save Record",
            parameters: {
              statePath: `${record.name}`,
            },
          },
          {
            "##eventHandlerType": "Set State",
            parameters: {
              path: `isEditing${record.name}`,
              value: "",
            },
          },
        ],
      }),
      paddedPanelForButton({
        _component: "common/Default Button",
        contentText: `Cancel`,
        onClick: [
          {
            "##eventHandlerType": "Set State",
            parameters: {
              path: `isEditing${record.name}`,
              value: "",
            },
          },
        ],
      }),
    ],
  },
})

const paddedPanelForButton = button => ({
  control: {
    _component: "@budibase/standard-components/div",
    className: "btn-group",
    children: [
      {
        component: button,
      },
    ],
  },
})
