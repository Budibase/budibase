import sanitizeUrl from "./utils/sanitizeUrl"
import { rowListUrl } from "./rowListScreen"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"
import { makePropSafe } from "@budibase/string-templates"
import {
  makeBreadcrumbContainer,
  makeTitleContainer,
  makeSaveButton,
  makeTableFormComponents,
  makeMainForm,
} from "./utils/commonComponents"

export default function(tables) {
  return tables.map(table => {
    return {
      name: `${table.name} - Detail`,
      create: () => createScreen(table),
      id: ROW_DETAIL_TEMPLATE,
    }
  })
}

export const ROW_DETAIL_TEMPLATE = "ROW_DETAIL_TEMPLATE"
export const rowDetailUrl = table => sanitizeUrl(`/${table.name}/:id`)

function generateTitleContainer(table, title, formId) {
  // have to override style for this, its missing margin
  const saveButton = makeSaveButton(table, formId).normalStyle({
    background: "#000000",
    "border-width": "0",
    "border-style": "None",
    color: "#fff",
    "font-family": "Inter",
    "font-weight": "500",
    "font-size": "14px",
  })

  const deleteButton = new Component("@budibase/standard-components/button")
    .normalStyle({
      background: "transparent",
      "border-width": "0",
      "border-style": "None",
      color: "#9e9e9e",
      "font-family": "Inter",
      "font-weight": "500",
      "font-size": "14px",
      "margin-right": "8px",
      "margin-left": "16px",
    })
    .hoverStyle({
      background: "transparent",
      color: "#4285f4",
    })
    .text("Delete")
    .customProps({
      className: "",
      disabled: false,
      onClick: [
        {
          parameters: {
            providerId: formId,
            rowId: `{{ ${makePropSafe(formId)}._id }}`,
            revId: `{{ ${makePropSafe(formId)}._rev }}`,
            tableId: table._id,
          },
          "##eventHandlerType": "Delete Row",
        },
        {
          parameters: {
            url: rowListUrl(table),
          },
          "##eventHandlerType": "Navigate To",
        },
      ],
    })
    .instanceName("Delete Button")

  return makeTitleContainer(title)
    .addChild(deleteButton)
    .addChild(saveButton)
}

const createScreen = table => {
  const screen = new Screen()
    .component("@budibase/standard-components/rowdetail")
    .table(table._id)
    .instanceName(`${table.name} - Detail`)
    .route(rowDetailUrl(table))

  const form = makeMainForm()
    .instanceName("Form")
    .customProps({
      theme: "spectrum--lightest",
      size: "spectrum--medium",
      datasource: {
        label: table.name,
        tableId: table._id,
        type: "table",
      },
    })

  const fieldGroup = new Component("@budibase/standard-components/fieldgroup")
    .instanceName("Field Group")
    .customProps({
      labelPosition: "left",
    })

  // Add all form fields from this schema to the field group
  makeTableFormComponents(table._id).forEach(component => {
    fieldGroup.addChild(component)
  })

  // Add all children to the form
  const formId = form._json._id
  const rowDetailId = screen._json.props._id
  const heading = table.primaryDisplay
    ? `{{ ${makePropSafe(rowDetailId)}.${makePropSafe(table.primaryDisplay)} }}`
    : null
  form
    .addChild(makeBreadcrumbContainer(table.name, heading || "Edit"))
    .addChild(generateTitleContainer(table, heading || "Edit Row", formId))
    .addChild(fieldGroup)

  return screen.addChild(form).json()
}
