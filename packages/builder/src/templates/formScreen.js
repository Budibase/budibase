import { Screen } from "./Screen"
import { Component } from "./Component"
import sanitizeUrl from "helpers/sanitizeUrl"

export const FORM_TEMPLATE = "FORM_TEMPLATE"
export const formUrl = (tableOrView, actionType) => {
  if (actionType === "Create") {
    return sanitizeUrl(`/${tableOrView.name}/new`)
  } else if (actionType === "Update") {
    return sanitizeUrl(`/${tableOrView.name}/edit/:id`)
  } else if (actionType === "View") {
    return sanitizeUrl(`/${tableOrView.name}/view/:id`)
  }
}

export const getRole = (permissions, actionType) => {
  if (actionType === "View") {
    return permissions.read
  }

  return permissions.write
}

const generateMultistepFormBlock = (tableOrView, actionType) => {
  const multistepFormBlock = new Component(
    "@budibase/standard-components/multistepformblock"
  )
  multistepFormBlock
    .customProps({
      actionType,
      dataSource: tableOrView.clientData,
      steps: [{}],
      rowId: actionType === "new" ? undefined : `{{ url.id }}`,
    })
    .instanceName(`${tableOrView.name} - Multistep Form block`)
  return multistepFormBlock
}

const createScreen = (tableOrView, actionType, permissions) => {
  return new Screen()
    .route(formUrl(tableOrView, actionType))
    .instanceName(`${tableOrView.name} - Form`)
    .role(getRole(permissions, actionType))
    .autoTableId(tableOrView.id)
    .addChild(generateMultistepFormBlock(tableOrView, actionType))
    .json()
}

export default createScreen
