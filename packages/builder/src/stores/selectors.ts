import { DEFAULT_BB_DATASOURCE_ID } from "@/constants/backend"
import {
  DatasourceFeature,
  DatasourceFieldType,
  SourceName,
  type Datasource,
  type Integration,
} from "@budibase/types"
import { cloneDeep } from "lodash/fp"

interface ListStore<T> {
  list: T[]
}

export const integrationForDatasource = (
  integrations: Partial<Record<SourceName, Integration>>,
  datasource: Datasource
): Partial<Integration> & { name: SourceName } => ({
  name: datasource.source,
  ...integrations[datasource.source],
})

export const hasData = <T, U>(
  datasources: ListStore<T>,
  tables: ListStore<U>
): boolean => datasources.list.length > 1 || tables.list.length > 1

export const hasDefaultData = (datasources: ListStore<Datasource>): boolean =>
  datasources.list.some(
    datasource => datasource._id === DEFAULT_BB_DATASOURCE_ID
  )

export const configFromIntegration = (
  integration?: Integration | null
): Record<string, unknown> => {
  const config: Record<string, unknown> = {}

  Object.entries(integration?.datasource || {}).forEach(([key, properties]) => {
    if (properties.type === DatasourceFieldType.FIELD_GROUP) {
      Object.keys(properties.fields || {}).forEach(fieldKey => {
        config[fieldKey] = null
      })
    } else {
      config[key] = cloneDeep(properties.default ?? null)
    }
  })

  return config
}

export const shouldIntegrationFetchTableNames = (
  integration: Integration
): boolean => {
  return !!integration.features?.[DatasourceFeature.FETCH_TABLE_NAMES]
}
