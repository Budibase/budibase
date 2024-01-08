import {
  Datasource,
  DatasourcePlus,
  IntegrationBase,
  Schema,
} from "@budibase/types"
import * as datasources from "./datasources"
import { getIntegration } from "../../../integrations"

export async function buildFilteredSchema(
  datasource: Datasource,
  filter?: string[]
): Promise<Schema> {
  const schema = await buildSchemaHelper(datasource)
  if (!filter) {
    return schema
  }

  let filteredSchema: Schema = { tables: {}, errors: {} }
  for (let key in schema.tables) {
    if (filter.some(filter => filter.toLowerCase() === key.toLowerCase())) {
      filteredSchema.tables[key] = schema.tables[key]
    }
  }

  for (let key in schema.errors) {
    if (filter.some(filter => filter.toLowerCase() === key.toLowerCase())) {
      filteredSchema.errors[key] = schema.errors[key]
    }
  }
  return filteredSchema
}

async function buildSchemaHelper(datasource: Datasource): Promise<Schema> {
  const connector = (await getConnector(datasource)) as DatasourcePlus
  const externalSchema = await connector.buildSchema(
    datasource._id!,
    datasource.entities!
  )
  return externalSchema
}

export async function getConnector(
  datasource: Datasource
): Promise<IntegrationBase | DatasourcePlus> {
  const Connector = await getIntegration(datasource.source)
  // can't enrich if it doesn't have an ID yet
  if (datasource._id) {
    datasource = await datasources.enrich(datasource)
  }
  // Connect to the DB and build the schema
  return new Connector(datasource.config)
}

export async function getAndMergeDatasource(datasource: Datasource) {
  if (datasource._id) {
    const existingDatasource = await datasources.get(datasource._id)

    datasource = datasources.mergeConfigs(datasource, existingDatasource)
  }
  return await datasources.enrich(datasource)
}
