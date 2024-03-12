import sanitizeUrl from "helpers/sanitizeUrl"
import { Screen } from "./Screen"
import { Component } from "./Component"

export default function (datasources) {
  if (!Array.isArray(datasources)) {
    return []
  }
  return datasources.map(datasource => {
    return {
      name: `${datasource.label} - List`,
      create: () => createScreen(datasource),
      id: GRID_LIST_TEMPLATE,
      resourceId: datasource.resourceId,
    }
  })
}

export const GRID_LIST_TEMPLATE = "GRID_LIST_TEMPLATE"
export const gridListUrl = datasource => sanitizeUrl(`/${datasource.label}`)

const createScreen = datasource => {
  const heading = new Component("@budibase/standard-components/heading")
    .instanceName("Table heading")
    .customProps({
      text: datasource?.label,
    })

  const gridBlock = new Component("@budibase/standard-components/gridblock")
    .instanceName(`${datasource.label} - Table`)
    .customProps({
      table: datasource,
    })

  return new Screen()
    .route(gridListUrl(datasource))
    .instanceName(`${datasource.label} - List`)
    .addChild(heading)
    .addChild(gridBlock)
    .json()
}
