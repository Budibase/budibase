import { Screen } from "../Screen"
import { Component } from "../../Component"
import { generate } from "shortid"
import { makePropSafe as safe } from "@budibase/string-templates"
import { Utils } from "@budibase/frontend-core"
import { capitalise } from "helpers"
import getValidRoute from "../getValidRoute"

const modal = ({ tableOrView, permissions, screens }) => {
  /*
    Create Row
   */
  const createRowModal = new Component("@budibase/standard-components/modal")
    .instanceName("New row modal")
    .customProps({
      size: "large",
    })

  const buttonGroup = new Component("@budibase/standard-components/buttongroup")
  const createButton = new Component("@budibase/standard-components/button")

  createButton.customProps({
    onClick: [
      {
        id: 0,
        "##eventHandlerType": "Open Modal",
        parameters: {
          id: createRowModal._json._id,
        },
      },
    ],
    text: "Create row",
    type: "cta",
  })

  buttonGroup
    .instanceName(`${tableOrView.name} - Create`)
    .customProps({
      hAlign: "right",
      buttons: [createButton.json()],
    })
    .gridDesktopColSpan(7, 13)
    .gridDesktopRowSpan(1, 3)

  const heading = new Component("@budibase/standard-components/heading")
    .instanceName("Table heading")
    .customProps({
      text: tableOrView.name,
    })
    .gridDesktopColSpan(1, 7)
    .gridDesktopRowSpan(1, 3)

  const createFormBlock = new Component(
    "@budibase/standard-components/formblock"
  )
  createFormBlock.instanceName("Create row form block").customProps({
    dataSource: tableOrView.tableSelectFormat,
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
      dataSource: tableOrView.tableSelectFormat,
    }),
  })

  createRowModal.addChild(createFormBlock)

  /*
    Edit Row
   */
  const stateKey = `ID_${generate()}`
  const detailsModal = new Component("@budibase/standard-components/modal")
    .instanceName("Edit row modal")
    .customProps({
      size: "large",
    })

  const editFormBlock = new Component("@budibase/standard-components/formblock")
  editFormBlock.instanceName("Edit row form block").customProps({
    dataSource: tableOrView.tableSelectFormat,
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
      dataSource: tableOrView.tableSelectFormat,
    }),
  })

  detailsModal.addChild(editFormBlock)

  const tableBlock = new Component("@budibase/standard-components/gridblock")
  tableBlock
    .customProps({
      table: tableOrView.datasourceSelectFormat,
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
          "##eventHandlerType": "Open Modal",
          parameters: {
            id: detailsModal._json._id,
          },
        },
      ],
    })
    .instanceName(`${tableOrView.name} - Table`)
    .gridDesktopColSpan(1, 13)
    .gridDesktopRowSpan(3, 21)

  const template = new Screen()
    .route(getValidRoute(screens, tableOrView.name, permissions.write))
    .instanceName(`${tableOrView.name} - List and details`)
    .customProps({ layout: "grid" })
    .role(permissions.write)
    .autoTableId(tableOrView.id)
    .addChild(buttonGroup)
    .addChild(heading)
    .addChild(tableBlock)
    .addChild(createRowModal)
    .addChild(detailsModal)
    .json()

  return [
    {
      data: template,
      navigationLinkLabel: capitalise(tableOrView.name),
    },
  ]
}

export default modal
