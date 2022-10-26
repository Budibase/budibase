import sanitizeUrl from "./utils/sanitizeUrl"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"
import { makeBreadcrumbContainer } from "./utils/commonComponents"
import { getSchemaForDatasource } from "../../dataBinding"

export default function (tables) {
  return tables.map(table => {
    return {
      name: `${table.name} - New`,
      create: () => createScreen(table),
      id: NEW_ROW_TEMPLATE,
      table: table._id,
    }
  })
}

export const newRowUrl = table => sanitizeUrl(`/${table.name}/new/row`)
export const NEW_ROW_TEMPLATE = "NEW_ROW_TEMPLATE"

const rowListUrl = table => sanitizeUrl(`/${table.name}`)

const getFields = schema => {
  let columns = []
  Object.entries(schema || {}).forEach(([field, fieldSchema]) => {
    if (!field || !fieldSchema) {
      return
    }
    if (!fieldSchema?.autocolumn) {
      columns.push(field)
    }
  })
  return columns
}

const generateFormBlock = table => {
  const datasource = { type: "table", tableId: table._id }
  const { schema } = getSchemaForDatasource(null, datasource, {
    formSchema: true,
  })
  const formBlock = new Component("@budibase/standard-components/formblock")
  formBlock
    .customProps({
      title: "New row",
      actionType: "Create",
      actionUrl: rowListUrl(table),
      showDeleteButton: false,
      showSaveButton: true,
      fields: getFields(schema),
      dataSource: {
        label: table.name,
        tableId: table._id,
        type: "table",
      },
      labelPosition: "left",
      size: "spectrum--medium",
    })
    .instanceName(`${table.name} - Form block`)
  return formBlock
}

const createScreen = table => {
  const formBlock = generateFormBlock(table)
  const screen = new Screen()
    .instanceName(`${table.name} - New`)
    .route(newRowUrl(table))

  return screen
    .addChild(makeBreadcrumbContainer(table.name, "New row"))
    .addChild(formBlock)
    .json()
}
