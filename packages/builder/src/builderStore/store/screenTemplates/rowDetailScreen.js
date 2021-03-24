import sanitizeUrl from "./utils/sanitizeUrl"
import { rowListUrl } from "./rowListScreen"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"
import { makePropSafe } from "@budibase/string-templates"
import {
  makeBreadcrumbContainer,
  makeTitleContainer,
  makeSaveButton,
  makeMainForm,
  spectrumColor,
  makeDatasourceFormComponents,
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

function generateTitleContainer(table, title, formId, repeaterId) {
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
    .customStyle(spectrumColor(700))
    .text("Delete")
    .customProps({
      className: "",
      disabled: false,
      onClick: [
        {
          parameters: {
            tableId: table._id,
            rowId: `{{ ${makePropSafe(repeaterId)}.${makePropSafe("_id")} }}`,
            revId: `{{ ${makePropSafe(repeaterId)}.${makePropSafe("_rev")} }}`,
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
  const provider = new Component("@budibase/standard-components/dataprovider")
    .instanceName(`Data Provider`)
    .customProps({
      dataSource: {
        label: table.name,
        name: `all_${table._id}`,
        tableId: table._id,
        type: "table",
      },
      filter: {
        _id: `{{ ${makePropSafe("url")}.${makePropSafe("id")} }}`,
      },
      limit: 1,
    })

  const repeater = new Component("@budibase/standard-components/repeater")
    .instanceName("Repeater")
    .customProps({
      dataProvider: `{{ literal ${makePropSafe(provider._json._id)} }}`,
    })

  const form = makeMainForm()
    .instanceName("Form")
    .customProps({
      theme: "spectrum--lightest",
      size: "spectrum--medium",
      dataSource: {
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
  const datasource = { type: "table", tableId: table._id }
  makeDatasourceFormComponents(datasource).forEach(component => {
    fieldGroup.addChild(component)
  })

  // Add all children to the form
  const formId = form._json._id
  const repeaterId = repeater._json._id
  const heading = table.primaryDisplay
    ? `{{ ${makePropSafe(repeaterId)}.${makePropSafe(table.primaryDisplay)} }}`
    : null
  form
    .addChild(makeBreadcrumbContainer(table.name, heading || "Edit"))
    .addChild(
      generateTitleContainer(table, heading || "Edit Row", formId, repeaterId)
    )
    .addChild(fieldGroup)

  repeater.addChild(form)
  provider.addChild(repeater)

  return new Screen()
    .component("@budibase/standard-components/container")
    .instanceName(`${table.name} - Detail`)
    .route(rowDetailUrl(table))
    .addChild(provider)
    .json()
}
