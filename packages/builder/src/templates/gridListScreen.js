import sanitizeUrl from "helpers/sanitizeUrl"
import { Screen } from "./Screen"
import { Component } from "./Component"

const gridListUrl = datasource => sanitizeUrl(`/${datasource.label}`)

const createScreen = (datasource, permissions) => {
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
    .autoTableId(datasource.resourceId)
    .instanceName(`${datasource.label} - List`)
    .addChild(heading)
    .addChild(gridBlock)
    .json()
}

export default createScreen;
