import sanitizeUrl from "./utils/sanitizeUrl"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"
import { makeBreadcrumbContainer } from "./utils/commonComponents"
import { getSchemaForDatasource } from "../../dataBinding"

export default function (tables) {
  return tables.map(table => {
    return {
      name: `${table.name} - Detail`,
      create: () => createScreen(table),
      id: ROW_DETAIL_TEMPLATE,
      table: table._id,
    }
  })
}

export const ROW_DETAIL_TEMPLATE = "ROW_DETAIL_TEMPLATE"
export const rowDetailUrl = table => sanitizeUrl(`/${table.name}/:id`)

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
      title: "Edit row",
      actionType: "Update",
      actionUrl: rowListUrl(table),
      showDeleteButton: true,
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
  return new Screen()
    .instanceName(`${table.name} - Detail`)
    .route(rowDetailUrl(table))
    .addChild(makeBreadcrumbContainer(table.name, "Edit row"))
    .addChild(generateFormBlock(table))
    .json()
}
