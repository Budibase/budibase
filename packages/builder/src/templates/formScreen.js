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

const generateMultistepFormBlock = (dataSource, actionType) => {
  const multistepFormBlock = new Component(
    "@budibase/standard-components/multistepformblock"
  )
  multistepFormBlock
    .customProps({
      actionType,
      dataSource,
      steps: [{}],
      rowId: actionType === "new" ? undefined : `{{ url.id }}`
    })
    .instanceName(`${dataSource.label} - Multistep Form block`)
  return multistepFormBlock
}

const createScreen = (datasource, actionType) => {
  return new Screen()
    .route(formUrl(datasource, actionType))
    .instanceName(`${datasource.label} - Form`)
    .addChild(generateMultistepFormBlock(datasource, actionType))
    .json()
}

export default createScreen;
