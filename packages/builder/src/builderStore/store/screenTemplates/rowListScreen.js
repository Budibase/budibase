import sanitizeUrl from "./utils/sanitizeUrl"
import { newRowUrl } from "./newRowScreen"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"
import { makePropSafe } from "@budibase/string-templates"

export default function (tables) {
  return tables.map(table => {
    return {
      name: `${table.name} - List`,
      create: () => createScreen(table),
      id: ROW_LIST_TEMPLATE,
    }
  })
}

export const ROW_LIST_TEMPLATE = "ROW_LIST_TEMPLATE"
export const rowListUrl = table => sanitizeUrl(`/${table.name}`)

function generateTitleContainer(table) {
  const newButton = new Component("@budibase/standard-components/button")
    .text("Create New")
    .customProps({
      size: "M",
      type: "primary",
      onClick: [
        {
          parameters: {
            url: newRowUrl(table),
          },
          "##eventHandlerType": "Navigate To",
        },
      ],
    })
    .instanceName("New Button")

  const heading = new Component("@budibase/standard-components/heading")
    .instanceName("Title")
    .text(table.name)
    .customProps({
      size: "M",
      align: "left",
    })

  return new Component("@budibase/standard-components/container")
    .customProps({
      direction: "row",
      hAlign: "stretch",
      vAlign: "middle",
      size: "shrink",
      gap: "M",
    })
    .instanceName("Title Container")
    .addChild(heading)
    .addChild(newButton)
}

const createScreen = table => {
  const provider = new Component("@budibase/standard-components/dataprovider")
    .instanceName(`Data Provider`)
    .customProps({
      dataSource: {
        label: table.name,
        name: table._id,
        tableId: table._id,
        type: "table",
      },
      paginate: true,
      limit: 8,
    })

  const spectrumTable = new Component("@budibase/standard-components/table")
    .customProps({
      dataProvider: `{{ literal ${makePropSafe(provider._json._id)} }}`,
      showAutoColumns: false,
      quiet: false,
      rowCount: 8,
    })
    .instanceName(`${table.name} Table`)

  const safeTableId = makePropSafe(spectrumTable._json._id)
  const safeRowId = makePropSafe("_id")
  const viewLink = new Component("@budibase/standard-components/link")
    .customProps({
      text: "View",
      url: `${rowListUrl(table)}/{{ ${safeTableId}.${safeRowId} }}`,
      size: "S",
      color: "var(--spectrum-global-color-gray-600)",
      align: "left",
    })
    .normalStyle({
      ["margin-left"]: "16px",
      ["margin-right"]: "16px",
    })
    .instanceName("View Link")

  spectrumTable.addChild(viewLink)
  provider.addChild(spectrumTable)

  return new Screen()
    .route(rowListUrl(table))
    .instanceName(`${table.name} - List`)
    .addChild(generateTitleContainer(table))
    .addChild(provider)
    .json()
}
