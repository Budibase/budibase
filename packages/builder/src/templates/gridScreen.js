import sanitizeUrl from "helpers/sanitizeUrl"
import { Screen } from "./Screen"
import { Component } from "./Component"

const gridUrl = tableOrView => sanitizeUrl(`/${tableOrView.name}`)

const createScreen = (tableOrView, permissions) => {
  const heading = new Component("@budibase/standard-components/heading")
    .instanceName("Table heading")
    .customProps({
      text: tableOrView.name,
    })

  const gridBlock = new Component("@budibase/standard-components/gridblock")
    .instanceName(`${tableOrView.name} - Table`)
    .customProps({
      table: tableOrView.clientData,
    })

  return new Screen()
    .route(gridUrl(tableOrView))
    .instanceName(`${tableOrView.name} - List`)
    .role(permissions.write)
    .autoTableId(tableOrView.id)
    .addChild(heading)
    .addChild(gridBlock)
    .json()
}

export default createScreen
