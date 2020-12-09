import sanitizeUrl from "./utils/sanitizeUrl"
import { Component } from "./utils/Component"
import { Screen } from "./utils/Screen"
import {
  makeBreadcrumbContainer,
  makeMainContainer,
  makeTitleContainer,
  makeSaveButton,
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

function generateTitleContainer(table) {
  return makeTitleContainer("New Row").addChild(makeSaveButton(table))
}

const createScreen = table => {
  const dataform = new Component(
    "@budibase/standard-components/dataformwide"
  ).instanceName("Form")

  const container = makeMainContainer()
    .addChild(makeBreadcrumbContainer(table.name, "New"))
    .addChild(generateTitleContainer(table))
    .addChild(dataform)

  return new Screen()
    .component("@budibase/standard-components/newrow")
    .table(table._id)
    .route(newRowUrl(table))
    .instanceName(`${table.name} - New`)
    .name("")
    .addChild(container)
    .json()
}
