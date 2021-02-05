import sanitizeUrl from "./utils/sanitizeUrl"
import { rowListUrl } from "./rowListScreen"
import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"
import { makePropSafe } from "@budibase/string-templates"
import {
  makeMainContainer,
  makeBreadcrumbContainer,
  makeTitleContainer,
  makeSaveButton,
} from "./utils/commonComponents"

export default function(tables) {
  return tables.map(table => {
    const heading = table.primaryDisplay
      ? `{{ data.${makePropSafe(table.primaryDisplay)} }}`
      : null
    return {
      name: `${table.name} - Detail`,
      create: () => createScreen(table, heading),
      id: ROW_DETAIL_TEMPLATE,
    }
  })
}

export const ROW_DETAIL_TEMPLATE = "ROW_DETAIL_TEMPLATE"
export const rowDetailUrl = table => sanitizeUrl(`/${table.name}/:id`)

function generateTitleContainer(table, title, providerId) {
  // have to override style for this, its missing margin
  const saveButton = makeSaveButton(table, providerId).normalStyle({
    background: "#000000",
    "border-width": "0",
    "border-style": "None",
    color: "#fff",
    "font-family": "Inter",
    "font-weight": "500",
    "font-size": "14px",
  })

  const deleteButton = new Component("@budibase/standard-components/button")
    .normalStyle({
      background: "transparent",
      "border-width": "0",
      "border-style": "None",
      color: "#9e9e9e",
      "font-family": "Inter",
      "font-weight": "500",
      "font-size": "14px",
      "margin-right": "8px",
      "margin-left": "16px",
    })
    .hoverStyle({
      background: "transparent",
      color: "#4285f4",
    })
    .text("Delete")
    .customProps({
      className: "",
      disabled: false,
      onClick: [
        {
          parameters: {
            rowId: `{{ ${makePropSafe(providerId)}._id }}`,
            revId: `{{ ${makePropSafe(providerId)}._rev }}`,
            tableId: table._id,
          },
          "##eventHandlerType": "Delete Row",
        },
        {
          parameters: {
            url: rowListUrl(table),
          },
          "##eventHandlerType": "Navigate To",
        },
      ],
    })
    .instanceName("Delete Button")

  return makeTitleContainer(title)
    .addChild(deleteButton)
    .addChild(saveButton)
}

const createScreen = (table, heading) => {
  const screen = new Screen()
    .component("@budibase/standard-components/rowdetail")
    .table(table._id)
    .instanceName(`${table.name} - Detail`)
    .route(rowDetailUrl(table))
    .name("")

  const dataform = new Component(
    "@budibase/standard-components/dataformwide"
  ).instanceName("Form")

  const providerId = screen._json.props._id
  const container = makeMainContainer()
    .addChild(makeBreadcrumbContainer(table.name, heading || "Edit"))
    .addChild(generateTitleContainer(table, heading || "Edit Row", providerId))
    .addChild(dataform)

  return screen.addChild(container).json()
}
