import { Screen } from "./Screen"
import { Component } from "../Component"
import getValidRoute from "./getValidRoute"

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

const form = ({ tableOrView, type, permissions, screens }) => {
  const typeSpecificRoute = getTypeSpecificRoute(tableOrView, type)
  const role = getRole(permissions, type)

  const multistepFormBlock = new Component(
    "@budibase/standard-components/multistepformblock"
  )
    .customProps({
      actionType: getActionType(type),
      dataSource: tableOrView.tableSelectFormat,
      steps: [{}],
      rowId: type === "new" ? undefined : `{{ url.id }}`,
    })
    .instanceName(`${tableOrView.name} - Multistep Form block`)

  const template = new Screen()
    .route(getValidRoute(screens, typeSpecificRoute, role))
    .instanceName(`${tableOrView.name} - Form`)
    .role(role)
    .autoTableId(tableOrView.id)
    .addChild(multistepFormBlock)
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
