import sanitizeUrl from "helpers/sanitizeUrl"
import { Screen } from "./Screen"
import { Component } from "./Component"

const gridUrl = datasource => sanitizeUrl(`/${datasource.label}`)

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
    .route(gridUrl(datasource))
    .instanceName(`${datasource.label} - List`)
    .role(permissions.write.role)
    .autoTableId(datasource.resourceId)
    .addChild(heading)
    .addChild(gridBlock)
    .json()
}

export default createScreen
