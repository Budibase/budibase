import sanitizeUrl from "helpers/sanitizeUrl"
import { Screen } from "./Screen"
import { Component } from "./Component"
import { generate } from "shortid"
import { makePropSafe as safe } from "@budibase/string-templates"
import { Utils } from "@budibase/frontend-core"

const gridDetailsUrl = tableOrView => sanitizeUrl(`/${tableOrView.name}`)

const createScreen = (tableOrView, permissions) => {
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

  buttonGroup.instanceName(`${tableOrView.name} - Create`).customProps({
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
      text: tableOrView.name,
    })

  gridHeader.addChild(heading)
  gridHeader.addChild(buttonGroup)

  const createFormBlock = new Component(
    "@budibase/standard-components/formblock"
  )
  createFormBlock.instanceName("Create row form block").customProps({
    dataSource: tableOrView.clientData,
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
      dataSource: tableOrView.clientData,
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
    dataSource: tableOrView.clientData,
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
      dataSource: tableOrView.clientData,
    }),
  })

  detailsSidePanel.addChild(editFormBlock)

  const gridBlock = new Component("@budibase/standard-components/gridblock")
  gridBlock
    .customProps({
      table: tableOrView.clientData,
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
    .instanceName(`${tableOrView.name} - Table`)

  return new Screen()
    .route(gridDetailsUrl(tableOrView))
    .instanceName(`${tableOrView.name} - List and details`)
    .role(permissions.write)
    .autoTableId(tableOrView.resourceId)
    .addChild(gridHeader)
    .addChild(gridBlock)
    .addChild(createRowSidePanel)
    .addChild(detailsSidePanel)
    .json()
}

export default createScreen
