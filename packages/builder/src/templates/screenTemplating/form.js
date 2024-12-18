import { Screen } from "./Screen"
import { Component } from "../Component"
import getValidRoute from "./getValidRoute"
import { componentStore } from "@/stores/builder"
import { Helpers } from "@budibase/bbui"
import { getRowActionButtonTemplates } from "@/templates/rowActions"

export const getTypeSpecificRoute = (tableOrView, type) => {
  if (type === "create") {
    return `/${tableOrView.name}/new`
  } else if (type === "update") {
    return `/${tableOrView.name}/edit/:id`
  } else if (type === "view") {
    return `/${tableOrView.name}/view/:id`
  }
}

const getRole = (permissions, type) => {
  if (type === "view") {
    return permissions.read
  }

  return permissions.write
}

const getActionType = type => {
  if (type === "create") {
    return "Create"
  }
  if (type === "update") {
    return "Update"
  }
  if (type === "view") {
    return "View"
  }
}

const getTitle = type => {
  if (type === "create") {
    return "Create row"
  } else if (type === "update") {
    return "Update row"
  }
  return "Row details"
}

const form = async ({ tableOrView, type, permissions, screens }) => {
  const id = Helpers.uuid()
  const typeSpecificRoute = getTypeSpecificRoute(tableOrView, type)
  const role = getRole(permissions, type)

  let formBlock = new Component("@budibase/standard-components/formblock", id)
    .customProps({
      dataSource: tableOrView.tableSelectFormat,
      actionType: getActionType(type),
      title: getTitle(type),
      rowId: type === "new" ? undefined : `{{ url.id }}`,
      buttonPosition: "bottom",
    })
    .instanceName(`${tableOrView.name} - Form block`)
    .json()

  // Add default button config
  componentStore.migrateSettings(formBlock)

  // Add row action buttons if required
  if (type !== "create") {
    const rowActionButtons = await getRowActionButtonTemplates({
      instance: formBlock,
    })
    if (rowActionButtons.length) {
      formBlock.buttons = [...(formBlock.buttons || []), ...rowActionButtons]

      // Collapse buttons if more than 3 row actions
      if (rowActionButtons.length > 3) {
        formBlock.buttonsCollapsed = true
      }
    }
  }

  const template = new Screen()
    .route(getValidRoute(screens, typeSpecificRoute, role))
    .instanceName(`${tableOrView.name} - Form`)
    .role(role)
    .autoTableId(tableOrView.id)
    .addChild(formBlock)
    .json()

  return [
    {
      data: template,
      navigationLinkLabel:
        type === "create" ? `Create ${tableOrView.name}` : null,
    },
  ]
}

export default form
