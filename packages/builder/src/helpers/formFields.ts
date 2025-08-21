import { getDatasourceForProvider, getSchemaForDatasource } from "@/dataBinding"
import {
  findClosestMatchingComponent,
  getComponentContexts,
} from "@/helpers/components"
import type { Component, Screen } from "@budibase/types"

const hasFormContext = (component: Component) => {
  const contexts = getComponentContexts(component._component)
  return contexts.some(context => context.type === "form")
}

export const getComponentFieldOptions = (
  asset: Screen | undefined,
  id: string,
  type: string,
  loose = true
) => {
  if (!asset) {
    return []
  }
  const form = findClosestMatchingComponent(asset.props, id, hasFormContext)
  if (!form) {
    return []
  }
  const datasource = getDatasourceForProvider(asset, form)
  const schema = getSchemaForDatasource(asset, datasource, {
    formSchema: true,
  }).schema

  // Get valid types for this field
  let types = [type]
  if (loose) {
    if (type === "field/options" || type === "field/longform") {
      // Allow options and longform to be used on string fields as well
      types = [type, "field/string"]
    }
  }
  types = types.map(type => type.slice(type.indexOf("/") + 1))

  // Find fields of valid types
  return Object.entries(schema || {})
    .filter(entry => types.includes(entry[1].type))
    .map(entry => entry[0])
}
