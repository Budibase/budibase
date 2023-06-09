import { IntegrationTypes, DEFAULT_BB_DATASOURCE_ID } from "constants/backend"

export const integrationForDatasource = (integrations, datasource) => ({
  name: datasource.source,
  ...integrations[datasource.source],
})

export const googleSheetsIntegration = integrations => ({
  name: IntegrationTypes.GOOGLE_SHEETS,
  ...integrations[IntegrationTypes.GOOGLE_SHEETS],
})

export const hasData = (datasources, tables) =>
  datasources.list.length > 1 || tables.list.length > 1

export const hasDefaultData = datasources =>
  datasources.list.some(
    datasource => datasource._id === DEFAULT_BB_DATASOURCE_ID
  )
