import sanitizeUrl from "helpers/sanitizeUrl"
import { Screen } from "./Screen"
import { Component } from "./Component"

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
  const tableBlock = new Component("@budibase/standard-components/tableblock")
  tableBlock
    .customProps({
      title: datasource.label,
      dataSource: datasource,
      sortOrder: "Ascending",
      size: "spectrum--medium",
      paginate: true,
      rowCount: 8,
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
