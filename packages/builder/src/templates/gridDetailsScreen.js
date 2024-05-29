import sanitizeUrl from "helpers/sanitizeUrl"
import { Screen } from "./Screen"
import { Component } from "./Component"
import { generate } from "shortid"
import { makePropSafe as safe } from "@budibase/string-templates"
import { Utils } from "@budibase/frontend-core"

export default function (datasources) {
  if (!Array.isArray(datasources)) {
    return []
  }
  return datasources.map(datasource => {
    return {
      name: `${datasource.label} - List with panel`,
      create: () => createScreen(datasource),
      id: GRID_DETAILS_TEMPLATE,
      resourceId: datasource.resourceId,
    }
  })
}

export const GRID_DETAILS_TEMPLATE = "GRID_DETAILS_TEMPLATE"
export const gridDetailsUrl = datasource => sanitizeUrl(`/${datasource.label}`)

const createScreen = datasource => {
  /*
    Create Row
   */
  const createRowSidePanel = new Component(
    "@budibase/standard-components/sidepanel"
  ).instanceName("New row side panel")

  const buttonGroup = new Component("@budibase/standard-components/buttongroup")
  const createButton = new Component("@budibase/standard-components/button")

  createButton.customProps({
    onClick: [
      {
        id: 0,
        "##eventHandlerType": "Open Side Panel",
        parameters: {
          id: createRowSidePanel._json._id,
        },
      },
    ],
    text: "Create row",
    type: "cta",
  })

  buttonGroup.instanceName(`${datasource.label} - Create`).customProps({
    hAlign: "right",
    buttons: [createButton.json()],
  })

  const gridHeader = new Component("@budibase/standard-components/container")
    .instanceName("Heading container")
    .customProps({
      direction: "row",
      hAlign: "stretch",
    })

  const heading = new Component("@budibase/standard-components/heading")
    .instanceName("Table heading")
    .customProps({
      text: datasource?.label,
    })

  gridHeader.addChild(heading)
  gridHeader.addChild(buttonGroup)

  const createFormBlock = new Component(
    "@budibase/standard-components/formblock"
  )
  createFormBlock.instanceName("Create row form block").customProps({
    dataSource: datasource,
    labelPosition: "left",
    buttonPosition: "top",
    actionType: "Create",
    title: "Create row",
    buttons: Utils.buildFormBlockButtonConfig({
      _id: createFormBlock._json._id,
      showDeleteButton: false,
      showSaveButton: true,
      saveButtonLabel: "Save",
      actionType: "Create",
      dataSource: datasource,
    }),
  })

  createRowSidePanel.addChild(createFormBlock)

  /*
    Edit Row
   */
  const stateKey = `ID_${generate()}`
  const detailsSidePanel = new Component(
    "@budibase/standard-components/sidepanel"
  ).instanceName("Edit row side panel")

  const editFormBlock = new Component("@budibase/standard-components/formblock")
  editFormBlock.instanceName("Edit row form block").customProps({
    dataSource: datasource,
    labelPosition: "left",
    buttonPosition: "top",
    actionType: "Update",
    title: "Edit",
    rowId: `{{ ${safe("state")}.${safe(stateKey)} }}`,
    buttons: Utils.buildFormBlockButtonConfig({
      _id: editFormBlock._json._id,
      showDeleteButton: true,
      showSaveButton: true,
      saveButtonLabel: "Save",
      deleteButtonLabel: "Delete",
      actionType: "Update",
      dataSource: datasource,
    }),
  })

  detailsSidePanel.addChild(editFormBlock)

  const gridBlock = new Component("@budibase/standard-components/gridblock")
  gridBlock
    .customProps({
      table: datasource,
      allowAddRows: false,
      allowEditRows: false,
      allowDeleteRows: false,
      onRowClick: [
        {
          id: 0,
          "##eventHandlerType": "Update State",
          parameters: {
            key: stateKey,
            type: "set",
            persist: false,
            value: `{{ ${safe("eventContext")}.${safe("row")}._id }}`,
          },
        },
        {
          id: 1,
          "##eventHandlerType": "Open Side Panel",
          parameters: {
            id: detailsSidePanel._json._id,
          },
        },
      ],
    })
    .instanceName(`${datasource.label} - Table`)

  return new Screen()
    .route(gridDetailsUrl(datasource))
    .instanceName(`${datasource.label} - List and details`)
    .addChild(gridHeader)
    .addChild(gridBlock)
    .addChild(createRowSidePanel)
    .addChild(detailsSidePanel)
    .json()
}
