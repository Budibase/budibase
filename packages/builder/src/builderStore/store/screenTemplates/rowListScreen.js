import sanitizeUrl from "./utils/sanitizeUrl"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"

export default function (datasources) {
  if (!Array.isArray(datasources)) {
    return []
  }
  return datasources.map(datasource => {
    return {
      name: `${datasource.label} - List`,
      create: () => createScreen(datasource),
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

const createScreen = datasource => {
  return new Screen()
    .route(rowListUrl(datasource))
    .instanceName(`${datasource.label} - List`)
    .addChild(generateTableBlock(datasource))
    .json()
}
