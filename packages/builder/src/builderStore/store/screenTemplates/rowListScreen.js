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
      title: toTitleCase(datasource.label),
      dataSource: datasource,
      sortOrder: "Ascending",
      size: "spectrum--medium",
      paginate: true,
      rowCount: 8,
      tableColumns: createCustomColumns(table.schema),
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

/**
 * If the table schema has fields with snake case or pascal case,
 * then return custom columns with pretty labels
 */
const createCustomColumns = schema => {
  let snakeCasePresent = false,
    pascalCasePresent = false
  let customTableColumns = []
  for (const key in schema) {
    if (key.includes("_")) {
      snakeCasePresent = true
    }
    if (key.match(/([a-z][A-Z])/g)) {
      pascalCasePresent = true
    }
    customTableColumns.push({
      displayName: createDisplayName(key),
      name: key,
      id: generate(),
    })
  }
  return snakeCasePresent || pascalCasePresent ? customTableColumns : undefined
}

/**
 * Replaces underscores with spaces
 * Inserts a space between capitalised words
 * Capitalises the first character
 */
const createDisplayName = str => {
  let spacedWords = str
    .replaceAll("_", " ")
    .replace(/([A-Z]+)/g, " $1")
    .trim()
  return spacedWords.charAt(0).toUpperCase() + spacedWords.substr(1)
}

/**
 * Converts snake case, pascal case, etc to title case
 */
const toTitleCase = str => {
  return createDisplayName(str).replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}
