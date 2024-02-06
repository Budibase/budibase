import sanitizeUrl from "./utils/sanitizeUrl"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"
import { tables } from "../../../stores/backend"
import { get } from "svelte/store"
import { generate } from "shortid"

export default function (datasources, mode = "table") {
  if (!Array.isArray(datasources)) {
    return []
  }
  return datasources.map(datasource => {
    return {
      name: `${datasource.label} - List`,
      create: () => createScreen(datasource, mode),
      id: ROW_LIST_TEMPLATE,
      resourceId: datasource.resourceId,
    }
  })
}

export const ROW_LIST_TEMPLATE = "ROW_LIST_TEMPLATE"
export const rowListUrl = datasource => sanitizeUrl(`/${datasource.label}`)

const generateTableBlock = datasource => {
  const table = get(tables).list.find(table => table._id === datasource.tableId)
  const tableBlock = new Component("@budibase/standard-components/tableblock")
  tableBlock
    .customProps({
      title: datasource.label,
      dataSource: datasource,
      sortOrder: "Ascending",
      size: "spectrum--medium",
      paginate: true,
      rowCount: 8,
      tableColumns: createCustomColumns(table),
      clickBehaviour: "details",
      showTitleButton: true,
      titleButtonText: "Create row",
      titleButtonClickBehaviour: "new",
      sidePanelSaveLabel: "Save",
      sidePanelDeleteLabel: "Delete",
    })
    .instanceName(`${datasource.label} - Table block`)
  return tableBlock
}

const generateGridBlock = datasource => {
  const gridBlock = new Component("@budibase/standard-components/gridblock")
  gridBlock
    .customProps({
      table: datasource,
    })
    .instanceName(`${datasource.label} - Grid block`)
  return gridBlock
}

const createScreen = (datasource, mode) => {
  return new Screen()
    .route(rowListUrl(datasource))
    .instanceName(`${datasource.label} - List`)
    .addChild(
      mode === "table"
        ? generateTableBlock(datasource)
        : generateGridBlock(datasource)
    )
    .json()
}

const createCustomColumns = table => {
  let snakeCasePresent = false
  let customTableColumns = []
  for (const key in table.schema) {
    if (key.includes("_")) {
      snakeCasePresent = true
    }
    customTableColumns.push({
      displayName: key.replaceAll("_", " "),
      name: key,
      id: generate(),
    })
  }
  return snakeCasePresent ? customTableColumns : undefined
}
