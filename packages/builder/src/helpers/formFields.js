import { findClosestMatchingComponent } from "builderStore/componentUtils"
import {
  getDatasourceForProvider,
  getSchemaForDatasource,
} from "builderStore/dataBinding"

export const getComponentFieldOptions = (asset, id, type, loose = true) => {
  const form = findClosestMatchingComponent(
    asset,
    id,
    component => component._component === "@budibase/standard-components/form"
  )
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
