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
  makeDatasourceFormComponents,
} from "./utils/commonComponents"

export default function (tables) {
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
  const saveButton = makeSaveButton(table, formId)
  const deleteButton = new Component("@budibase/standard-components/button")
    .text("Delete")
    .customProps({
      type: "secondary",
      quiet: true,
      size: "M",
      onClick: [
        {
          parameters: {
            tableId: table._id,
            rowId: `{{ ${makePropSafe(repeaterId)}.${makePropSafe("_id")} }}`,
            revId: `{{ ${makePropSafe(repeaterId)}.${makePropSafe("_rev")} }}`,
            confirm: true,
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

  const buttons = new Component("@budibase/standard-components/container")
    .instanceName("Button Container")
    .customProps({
      direction: "row",
      hAlign: "right",
      vAlign: "middle",
      size: "shrink",
      gap: "M",
    })
    .addChild(deleteButton)
    .addChild(saveButton)

  return makeTitleContainer(title).addChild(buttons)
}

const createScreen = table => {
  const provider = new Component("@budibase/standard-components/dataprovider")
    .instanceName(`Data Provider`)
    .customProps({
      dataSource: {
        label: table.name,
        name: table._id,
        tableId: table._id,
        type: "table",
      },
      filter: [
        {
          field: "_id",
          operator: "equal",
          type: "string",
          value: `{{ ${makePropSafe("url")}.${makePropSafe("id")} }}`,
          valueType: "Binding",
        },
      ],
      limit: table.type === "external" ? undefined : 1,
      paginate: false,
    })

  const repeater = new Component("@budibase/standard-components/repeater")
    .instanceName("Repeater")
    .customProps({
      dataProvider: `{{ literal ${makePropSafe(provider._json._id)} }}`,
    })

  const form = makeMainForm()
    .instanceName("Form")
    .customProps({
      actionType: "Update",
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
    .instanceName(`${table.name} - Detail`)
    .route(rowDetailUrl(table))
    .customProps({
      hAlign: "center",
    })
    .addChild(provider)
    .json()
}
