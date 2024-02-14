import { Screen } from "./utils/Screen"
import { Component } from "./utils/Component"
import sanitizeUrl from "./utils/sanitizeUrl"

export const FORM_TEMPLATE = "FORM_TEMPLATE"
export const formUrl = datasource => sanitizeUrl(`/${datasource.label}-form`)

// Mode not really necessary
export default function (datasources, config) {
  if (!Array.isArray(datasources)) {
    return []
  }
  return datasources.map(datasource => {
    return {
      name: `${datasource.label} - Form`,
      create: () => createScreen(datasource, config),
      id: FORM_TEMPLATE,
      resourceId: datasource.resourceId,
    }
  })
}

const generateMultistepFormBlock = (dataSource, { actionType } = {}) => {
  const multistepFormBlock = new Component(
    "@budibase/standard-components/multistepformblock"
  )
  multistepFormBlock
    .customProps({
      actionType,
      dataSource,
      steps: [{}],
    })
    .instanceName(`${dataSource.label} - Multistep Form block`)
  return multistepFormBlock
}

const createScreen = (datasource, config) => {
  return new Screen()
    .route(formUrl(datasource))
    .instanceName(`${datasource.label} - Form`)
    .addChild(generateMultistepFormBlock(datasource, config))
    .json()
}
