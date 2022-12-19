import sanitizeUrl from "./utils/sanitizeUrl"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"

export default function (tables) {
  return tables.map(table => {
    return {
      name: `${table.name} - List`,
      create: () => createScreen(table),
      id: ROW_LIST_TEMPLATE,
      table: table._id,
    }
  })
}

export const ROW_LIST_TEMPLATE = "ROW_LIST_TEMPLATE"
export const rowListUrl = table => sanitizeUrl(`/${table.name}`)

const generateTableBlock = table => {
  const tableBlock = new Component("@budibase/standard-components/tableblock")
  tableBlock
    .customProps({
      title: table.name,
      dataSource: {
        label: table.name,
        name: table._id,
        tableId: table._id,
        type: "table",
      },
      sortOrder: "Ascending",
      size: "spectrum--medium",
      paginate: true,
      rowCount: 8,
      clickBehaviour: "details",
      showTitleButton: true,
      titleButtonText: "Create row",
      titleButtonClickBehaviour: "new",
    })
    .instanceName(`${table.name} - Table block`)
  return tableBlock
}

const createScreen = table => {
  return new Screen()
    .route(rowListUrl(table))
    .instanceName(`${table.name} - List`)
    .addChild(generateTableBlock(table))
    .json()
}
