import { Screen } from "./Screen"
import { Component } from "./Component"
import sanitizeUrl from "helpers/sanitizeUrl"

export const FORM_TEMPLATE = "FORM_TEMPLATE"
export const formUrl = (datasource, actionType) => {
  if (actionType === "Create") {
    return sanitizeUrl(`/${datasource.label}/new`)
  } else if (actionType === "Update") {
    return sanitizeUrl(`/${datasource.label}/edit/:id`)
  } else if (actionType === "View") {
    return sanitizeUrl(`/${datasource.label}/view/:id`)
  }
}

const generateMultistepFormBlock = (datasource, actionType) => {
  const multistepFormBlock = new Component(
    "@budibase/standard-components/multistepformblock"
  )
  multistepFormBlock
    .customProps({
      actionType,
      datasource,
      steps: [{}],
      rowId: actionType === "new" ? undefined : `{{ url.id }}`,

    })
    .instanceName(`${datasource.label} - Multistep Form block`)
  return multistepFormBlock
}

const createScreen = (datasource, actionType, permissions) => {
  return new Screen()
    .route(formUrl(datasource, actionType))
    .autoTableId(datasource.resourceId)
    .instanceName(`${datasource.label} - Form`)
    .addChild(generateMultistepFormBlock(datasource, actionType))
    .json()
}

export default createScreen;
