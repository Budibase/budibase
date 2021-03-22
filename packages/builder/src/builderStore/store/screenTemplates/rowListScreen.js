import sanitizeUrl from "./utils/sanitizeUrl"
import { newRowUrl } from "./newRowScreen"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"

export default function(tables) {
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
    .normalStyle({
      background: "#000000",
      "border-width": "0",
      "border-style": "None",
      color: "#fff",
      "font-family": "Inter",
      "font-weight": "500",
      "font-size": "14px",
    })
    .hoverStyle({
      background: "#4285f4",
    })
    .text("Create New")
    .customProps({
      className: "",
      disabled: false,
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
    .normalStyle({
      margin: "0px",
      flex: "1 1 auto",
      "text-transform": "capitalize",
    })
    .type("h3")
    .instanceName("Title")
    .text(table.name)

  return new Component("@budibase/standard-components/container")
    .type("div")
    .normalStyle({
      display: "flex",
      "flex-direction": "row",
      "justify-content": "space-between",
      "align-items": "center",
      "margin-bottom": "32px",
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
        name: `all_${table._id}`,
        tableId: table._id,
        type: "table",
      },
    })

  const grid = new Component("@budibase/standard-components/datagrid")
    .customProps({
      dataProvider: `{{ literal ${provider._json._id} }}`,
      editable: false,
      theme: "alpine",
      height: "540",
      pagination: true,
      detailUrl: `${rowListUrl(table)}/:id`,
    })
    .instanceName("Grid")

  provider.addChild(grid)

  const mainContainer = new Component("@budibase/standard-components/container")
    .normalStyle({
      background: "white",
      "border-radius": "0.5rem",
      "box-shadow": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      margin: "auto",
      "margin-top": "20px",
      "border-width": "2px",
      "border-color": "rgba(0, 0, 0, 0.1)",
      "border-style": "None",
      "padding-top": "48px",
      "padding-bottom": "48px",
      "padding-right": "48px",
      "padding-left": "48px",
      "margin-bottom": "20px",
    })
    .type("div")
    .instanceName("Container")
    .addChild(generateTitleContainer(table))
    .addChild(provider)

  return new Screen()
    .component("@budibase/standard-components/container")
    .mainType("div")
    .route(rowListUrl(table))
    .instanceName(`${table.name} - List`)
    .name("")
    .addChild(mainContainer)
    .json()
}
