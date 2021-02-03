import sanitizeUrl from "./utils/sanitizeUrl"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"
import {
  makeBreadcrumbContainer,
  makeMainForm,
  makeTitleContainer,
  makeSaveButton,
  makeTableFormComponents,
} from "./utils/commonComponents"

export default function(tables) {
  return tables.map(table => {
    return {
      name: `${table.name} - New`,
      create: () => createScreen(table),
      id: NEW_ROW_TEMPLATE,
    }
  })
}

export const newRowUrl = table => sanitizeUrl(`/${table.name}/new/row`)
export const NEW_ROW_TEMPLATE = "NEW_ROW_TEMPLATE"

function generateTitleContainer(table, formId) {
  return makeTitleContainer("New Row").addChild(makeSaveButton(table, formId))
}

const createScreen = table => {
  const screen = new Screen()
    .component("@budibase/standard-components/container")
    .instanceName(`${table.name} - New`)
    .route(newRowUrl(table))

  const form = makeMainForm()
    .instanceName("Form")
    .customProps({
      theme: "spectrum--light",
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
  form
    .addChild(makeBreadcrumbContainer(table.name, "New"))
    .addChild(generateTitleContainer(table, formId))
    .addChild(fieldGroup)

  return screen.addChild(form).json()
}
