import { context } from "@budibase/backend-core"
import {
  Datasource,
  DatasourcePlus,
  IntegrationBase,
  Schema,
  Table,
  SourceName,
} from "@budibase/types"
import sdk from "../.."
import { getIntegration } from "../../../integrations"
import tableSdk from "../tables"
import * as datasources from "./datasources"
import { generateQueryID } from "../../../db/utils"

function checkForSchemaErrors(schema: Record<string, Table>) {
  const errors: Record<string, string> = {}
  for (let [tableName, table] of Object.entries(schema)) {
    if (tableName.includes(".")) {
      errors[tableName] = "Table names containing dots are not supported."
    } else {
      const columnNames = Object.keys(table.schema)
      const invalidColumnName = columnNames.find(columnName =>
        columnName.includes(".")
      )
      if (invalidColumnName) {
        errors[tableName] =
          `Column '${invalidColumnName}' is not supported as it contains a dot.`
      }
    }
  }
  return errors
}

export async function buildFilteredSchema(
  datasource: Datasource,
  filter?: string[]
): Promise<Schema> {
  const schema = await buildSchemaHelper(datasource, filter)
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

  return {
    ...filteredSchema,
    errors: {
      ...filteredSchema.errors,
      ...checkForSchemaErrors(filteredSchema.tables),
    },
  }
}

async function createQueriesForViews(datasourceId: string) {
  const db = context.getWorkspaceDB()
  const datasource = await datasources.get(datasourceId)
  const Integration = await getIntegration(datasource.source)
  const connector = new Integration(datasource.config) as any

  if (typeof connector.getViewNames === "function") {
    const viewNames = await connector.getViewNames()

    for (const viewName of viewNames) {
      // Check if query already exists
      const existingQueries = await db.allDocs({
        include_docs: true,
        startkey: `query_${datasourceId}_`,
        endkey: `query_${datasourceId}_\ufff0`,
      })

      const existingQuery = existingQueries.rows.find(
        (row: any) =>
          row.doc?.name === viewName && row.doc?.datasourceId === datasourceId
      )

      if (!existingQuery) {
        // Create a new query for the view
        const queryId = generateQueryID(datasourceId)
        const query = {
          _id: queryId,
          datasourceId,
          name: viewName,
          parameters: [],
          fields: {
            sql: `SELECT * FROM "${viewName}"`,
          },
          transformer: "",
          schema: {},
          readable: true,
          queryVerb: "read" as const,
          nullDefaultSupport: true,
        }

        await db.put(query)
      }
    }
  }
}

async function buildSchemaHelper(
  datasource: Datasource,
  filter?: string[]
): Promise<Schema> {
  const connector = (await getConnector(datasource)) as DatasourcePlus
  return await connector.buildSchema(
    datasource._id!,
    datasource.entities!,
    filter
  )
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

export async function buildSchemaFromSource(
  datasourceId: string,
  tablesFilter?: string[]
) {
  const db = context.getWorkspaceDB()

  const datasource = await datasources.get(datasourceId)

  const { tables, errors } = await buildFilteredSchema(datasource, tablesFilter)

  const oldTables = datasource.entities || {}
  const tablesToRemove = Object.keys(oldTables).filter(
    t => !Object.keys(tables).includes(t)
  )
  for (const table of tablesToRemove) {
    await sdk.rowActions.deleteAll(oldTables[table]._id!)
  }

  datasource.entities = tables

  // Create queries for PostgreSQL views
  if (datasource.source === SourceName.POSTGRES) {
    await createQueriesForViews(datasourceId)
  }

  datasources.setDefaultDisplayColumns(datasource)
  const dbResp = await db.put(tableSdk.populateExternalTableSchemas(datasource))
  datasource._rev = dbResp.rev

  return {
    datasource,
    errors,
  }
}
