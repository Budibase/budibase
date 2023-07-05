import { DEFAULT_BB_DATASOURCE_ID } from "constants/backend"
import { DatasourceFeature } from "@budibase/types"

export const integrationForDatasource = (integrations, datasource) => ({
  name: datasource.source,
  ...integrations[datasource.source],
})

export const hasData = (datasources, tables) =>
  datasources.list.length > 1 || tables.list.length > 1

export const hasDefaultData = datasources =>
  datasources.list.some(
    datasource => datasource._id === DEFAULT_BB_DATASOURCE_ID
  )

export const configFromIntegration = integration => {
  const config = {}

  Object.entries(integration?.datasource || {}).forEach(([key, properties]) => {
    if (properties.type === "fieldGroup") {
      Object.keys(properties.fields).forEach(fieldKey => {
        config[fieldKey] = null
      })
    } else {
      config[key] = properties.default ?? null
    }
  })

  return config
}

export const shouldIntegrationFetchTableNames = integration => {
  return integration.features?.[DatasourceFeature.FETCH_TABLE_NAMES]
}
