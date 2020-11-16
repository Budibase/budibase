import sanitizeUrl from "./utils/sanitizeUrl"
import { rowListUrl } from "./rowListScreen"
import { Component } from "./utils/Component"
import { Screen } from "./utils/Screen"
import { linkComponent } from "./utils/commonComponents"

export default function(tables) {
  return tables.map(table => {
    return {
      name: `${table.name} - New`,
      create: () => createScreen(table),
      id: NEW_ROW_TEMPLATE,
    }
  })
}

export const newRowUrl = table => sanitizeUrl(`/${table.name}/new`)
export const NEW_ROW_TEMPLATE = "NEW_ROW_TEMPLATE"

function breadcrumbContainer(table) {
  const link = linkComponent(table.name).instanceName("Back Link")

  const arrowText = new Component("@budibase/standard-components/text")
    .type("none")
    .normalStyle({
      "margin-right": "4px",
      "margin-left": "4px",
    })
    .text(">")
    .instanceName("Arrow")

  const newText = new Component("@budibase/standard-components/text")
    .type("none")
    .normalStyle({
      color: "#000000",
    })
    .text("New")
    .instanceName("Identifier")

  return new Component("@budibase/standard-components/container")
    .type("div")
    .normalStyle({
      "font-size": "14px",
      color: "#757575",
    })
    .instanceName("Breadcrumbs")
    .addChild(link)
    .addChild(arrowText)
    .addChild(newText)
}

function titleContainer(table) {
  const heading = new Component("@budibase/standard-components/heading")
    .normalStyle({
      margin: "0px",
      "margin-bottom": "0px",
      "margin-right": "0px",
      "margin-top": "0px",
      "margin-left": "0px",
      flex: "1 1 auto",
    })
    .type("h3")
    .instanceName("Title")
    .text("New Row")

  const button = new Component("@budibase/standard-components/button")
    .normalStyle({
      background: "#000000",
      "border-width": "0",
      "border-style": "None",
      color: "#fff",
      "font-family": "Inter",
      "font-weight": "500",
      "font-size": "14px",
      "margin-left": "16px",
    })
    .hoverStyle({
      background: "#4285f4",
    })
    .text("Save")
    .customProps({
      className: "",
      disabled: false,
      onClick: [
        {
          parameters: {
            contextPath: "data",
            tableId: table._id,
          },
          "##eventHandlerType": "Save Row",
        },
        {
          parameters: {
            url: rowListUrl(table),
          },
          "##eventHandlerType": "Navigate To",
        },
      ],
    })
    .instanceName("Save Button")

  return new Component("@budibase/standard-components/container")
    .type("div")
    .normalStyle({
      display: "flex",
      "flex-direction": "row",
      "justify-content": "space-between",
      "align-items": "center",
      "margin-top": "32px",
      "margin-bottom": "32px",
    })
    .instanceName("Title Container")
    .addChild(heading)
    .addChild(button)
}

const createScreen = table => {
  const dataform = new Component("@budibase/standard-components/dataformwide")
    .instanceName("Form")

  const mainContainer = new Component("@budibase/standard-components/container")
    .type("div")
    .normalStyle({
      width: "700px",
      padding: "0px",
      background: "white",
      "border-radius": "0.5rem",
      "box-shadow": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      margin: "auto",
      "margin-top": "20px",
      "padding-top": "48px",
      "padding-bottom": "48px",
      "padding-right": "48px",
      "padding-left": "48px",
      "margin-bottom": "20px",
    })
    .instanceName("Container")
    .addChild(breadcrumbContainer(table))
    .addChild(titleContainer(table))
    .addChild(dataform)

  return new Screen().component("@budibase/standard-components/newrow")
    .addChild(mainContainer)
    .table(table._id)
    .route(newRowUrl(table))
    .instanceName(`${table.name} - New`)
    .name("")
    .json()
}
