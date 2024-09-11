import { Screen } from "../Screen"
import { Component } from "../../Component"
import { capitalise } from "helpers"
import getValidRoute from "../getValidRoute"

const inline = ({ tableOrView, permissions, screens }) => {
  const heading = new Component("@budibase/standard-components/heading")
    .instanceName("Table heading")
    .customProps({
      text: tableOrView.name,
    })
    .gridDesktopColSpan(1, 13)
    .gridDesktopRowSpan(1, 3)

  const tableBlock = new Component("@budibase/standard-components/gridblock")
    .instanceName(`${tableOrView.name} - Table`)
    .customProps({
      table: tableOrView.datasourceSelectFormat,
    })
    .gridDesktopColSpan(1, 13)
    .gridDesktopRowSpan(3, 21)

  const screenTemplate = new Screen()
    .route(getValidRoute(screens, tableOrView.name, permissions.write))
    .instanceName(`${tableOrView.name} - List`)
    .customProps({ layout: "grid" })
    .role(permissions.write)
    .autoTableId(tableOrView.id)
    .addChild(heading)
    .addChild(tableBlock)
    .json()

  return [
    {
      data: screenTemplate,
      navigationLinkLabel: capitalise(tableOrView.name),
    },
  ]
}

export default inline
