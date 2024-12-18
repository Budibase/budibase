import { Screen } from "../Screen"
import { Component } from "../../Component"
import { capitalise } from "@/helpers"
import { makePropSafe as safe } from "@budibase/string-templates"
import getValidRoute from "../getValidRoute"
import { Helpers } from "@budibase/bbui"
import { getRowActionButtonTemplates } from "@/templates/rowActions"

const getTableScreenTemplate = ({
  route,
  updateScreenRoute,
  createScreenRoute,
  tableOrView,
  permissions,
  gridLayout,
}) => {
  const buttonGroup = new Component("@budibase/standard-components/buttongroup")
  const createButton = new Component("@budibase/standard-components/button")

  createButton.customProps({
    onClick: [
      {
        "##eventHandlerType": "Navigate To",
        parameters: {
          type: "url",
          url: createScreenRoute,
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

  const updateScreenRouteSegments = updateScreenRoute.split(":id")
  if (updateScreenRouteSegments.length !== 2) {
    throw new Error("Provided edit screen route is invalid")
  }

  const tableBlock = new Component("@budibase/standard-components/gridblock")
    .instanceName(`${tableOrView.name} - Table`)
    .customProps({
      table: tableOrView.datasourceSelectFormat,
      allowAddRows: false,
      allowEditRows: false,
      allowDeleteRows: false,
      onRowClick: [
        {
          id: 0,
          "##eventHandlerType": "Navigate To",
          parameters: {
            type: "url",
            url: `${updateScreenRouteSegments[0]}{{ ${safe(
              "eventContext"
            )}.${safe("row")}._id }}${updateScreenRouteSegments[1]}`,
          },
        },
      ],
    })
    .gridDesktopColSpan(1, 13)
    .gridDesktopRowSpan(3, 21)

  const template = new Screen()
    .route(route)
    .instanceName(`${tableOrView.name} - List`)
    .customProps({ layout: gridLayout ? "grid" : "flex" })
    .role(permissions.write)
    .autoTableId(tableOrView.id)
    .addChild(heading)
    .addChild(buttonGroup)
    .addChild(tableBlock)
    .json()

  return {
    data: template,
    navigationLinkLabel: capitalise(tableOrView.name),
  }
}

const getUpdateScreenTemplate = async ({
  route,
  tableScreenRoute,
  tableOrView,
  permissions,
}) => {
  const formBlockId = Helpers.uuid()
  const formId = `${formBlockId}-form`
  const repeaterId = `${formBlockId}-repeater`

  const deleteButton = new Component("@budibase/standard-components/button")
    .instanceName("Delete button")
    .customProps({
      type: "warning",
      quiet: true,
      text: "Delete",
      onClick: [
        {
          "##eventHandlerType": "Delete Row",
          parameters: {
            confirm: true,
            tableId: tableOrView.id,
            rowId: `{{ ${safe(repeaterId)}.${safe("_id")} }}`,
            revId: `{{ ${safe(repeaterId)}.${safe("_rev")} }}`,
          },
        },
        {
          "##eventHandlerType": "Navigate To",
          parameters: {
            type: "url",
            url: tableScreenRoute,
          },
        },
      ],
    })

  const saveButton = new Component("@budibase/standard-components/button")
    .instanceName("Save button")
    .customProps({
      type: "cta",
      text: "Save",
      onClick: [
        {
          "##eventHandlerType": "Validate Form",
          parameters: {
            componentId: formId,
          },
        },
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            providerId: formId,
            tableId: tableOrView.id,
          },
        },
        {
          "##eventHandlerType": "Navigate To",
          parameters: {
            type: "url",
            url: tableScreenRoute,
          },
        },
      ],
    })

  let updateFormBlock = new Component(
    "@budibase/standard-components/formblock",
    formBlockId
  )
    .instanceName("Update row form block")
    .customProps({
      dataSource: tableOrView.tableSelectFormat,
      labelPosition: "left",
      buttonPosition: "bottom",
      actionType: "Update",
      title: `Update ${tableOrView.name} row`,
    })

  // Generate button config including row actions
  let buttons = [saveButton.json(), deleteButton.json()]
  const rowActionButtons = await getRowActionButtonTemplates({
    instance: updateFormBlock.json(),
  })
  buttons = [...(buttons || []), ...rowActionButtons]
  updateFormBlock = updateFormBlock.customProps({
    buttons,
    buttonsCollapsed: buttons.length > 5,
  })

  const template = new Screen()
    .route(route)
    .instanceName(`Update row`)
    .role(permissions.write)
    .autoTableId(tableOrView.id)
    .addChild(updateFormBlock)
    .json()

  return {
    data: template,
    navigationLinkLabel: null,
  }
}

const getCreateScreenTemplate = ({
  route,
  tableScreenRoute,
  tableOrView,
  permissions,
}) => {
  const formBlockId = Helpers.uuid()
  const formId = `${formBlockId}-form`

  const saveButton = new Component("@budibase/standard-components/button")
    .instanceName("Save button")
    .customProps({
      type: "cta",
      text: "Save",
      onClick: [
        {
          "##eventHandlerType": "Validate Form",
          parameters: {
            componentId: formId,
          },
        },
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            providerId: formId,
            tableId: tableOrView.id,
          },
        },
        {
          "##eventHandlerType": "Navigate To",
          parameters: {
            type: "url",
            url: tableScreenRoute,
          },
        },
      ],
    })

  const createFormBlock = new Component(
    "@budibase/standard-components/formblock",
    formBlockId
  )
    .instanceName("Create row form block")
    .customProps({
      dataSource: tableOrView.tableSelectFormat,
      labelPosition: "left",
      buttonPosition: "bottom",
      actionType: "Create",
      title: `Create ${tableOrView.name} row`,
      buttons: [saveButton.json()],
    })

  const template = new Screen()
    .route(route)
    .instanceName("Create row")
    .role(permissions.write)
    .autoTableId(tableOrView.id)
    .addChild(createFormBlock)
    .json()

  return {
    data: template,
    navigationLinkLabel: null,
  }
}

const newScreen = async ({ tableOrView, permissions, screens }) => {
  const tableScreenRoute = getValidRoute(
    screens,
    tableOrView.name,
    permissions.write
  )

  const updateScreenRoute = getValidRoute(
    screens,
    `/${tableOrView.name}/edit/:id`,
    permissions.write
  )

  const createScreenRoute = getValidRoute(
    screens,
    `/${tableOrView.name}/new`,
    permissions.write
  )

  const tableScreenTemplate = getTableScreenTemplate({
    route: tableScreenRoute,
    updateScreenRoute,
    createScreenRoute,
    permissions,
    tableOrView,
    gridLayout: true,
  })

  const updateScreenTemplate = await getUpdateScreenTemplate({
    route: updateScreenRoute,
    tableScreenRoute,
    tableOrView,
    permissions,
    gridLayout: false,
  })

  const createScreenTemplate = getCreateScreenTemplate({
    route: createScreenRoute,
    tableScreenRoute,
    tableOrView,
    permissions,
    gridLayout: false,
  })

  return [tableScreenTemplate, updateScreenTemplate, createScreenTemplate]
}

export default newScreen
