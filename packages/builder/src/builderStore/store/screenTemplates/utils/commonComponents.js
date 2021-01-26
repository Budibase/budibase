import { Component } from "./Component"
import { rowListUrl } from "../rowListScreen"

export function makeLinkComponent(tableName) {
  return new Component("@budibase/standard-components/link")
    .normalStyle({
      color: "#757575",
      "text-transform": "capitalize",
    })
    .hoverStyle({
      color: "#4285f4",
    })
    .text(tableName)
    .customProps({
      url: `/${tableName.toLowerCase()}`,
      openInNewTab: false,
      color: "",
      hoverColor: "",
      underline: false,
      fontSize: "",
      fontFamily: "initial",
    })
}

export function makeMainContainer() {
  return new Component("@budibase/standard-components/container")
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
}

export function makeBreadcrumbContainer(tableName, text, capitalise = false) {
  const link = makeLinkComponent(tableName).instanceName("Back Link")

  const arrowText = new Component("@budibase/standard-components/text")
    .type("none")
    .normalStyle({
      "margin-right": "4px",
      "margin-left": "4px",
    })
    .text(">")
    .instanceName("Arrow")

  const textStyling = {
    color: "#000000",
  }
  if (capitalise) {
    textStyling["text-transform"] = "capitalize"
  }
  const identifierText = new Component("@budibase/standard-components/text")
    .type("none")
    .normalStyle(textStyling)
    .text(text)
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
    .addChild(identifierText)
}

export function makeSaveButton(table, providerId) {
  return new Component("@budibase/standard-components/button")
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
            providerId,
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
}

export function makeTitleContainer(title) {
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
    .text(title)

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
}
