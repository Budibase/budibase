import {
  generateDatasourceID,
  getDatasourceParams,
  getQueryParams,
  DocumentType,
  BudibaseInternalDB,
  getTableParams,
} from "../../db/utils"
import { destroy as tableDestroy } from "./table/internal"
import { BuildSchemaErrors, InvalidColumns } from "../../constants"
import { getIntegration } from "../../integrations"
import { getDatasourceAndQuery } from "./row/utils"
import { invalidateDynamicVariables } from "../../threads/utils"
import { db as dbCore, context, events, cache } from "@budibase/backend-core"
import {
  UserCtx,
  Datasource,
  Row,
  CreateDatasourceResponse,
  UpdateDatasourceResponse,
  CreateDatasourceRequest,
  VerifyDatasourceRequest,
  VerifyDatasourceResponse,
  FetchDatasourceInfoRequest,
  FetchDatasourceInfoResponse,
  IntegrationBase,
  DatasourcePlus,
  SourceName,
} from "@budibase/types"
import sdk from "../../sdk"
import { builderSocket } from "../../websockets"

function getErrorTables(errors: any, errorType: string) {
  return Object.entries(errors)
    .filter(entry => entry[1] === errorType)
    .map(([name]) => name)
}

function updateError(error: any, newError: any, tables: string[]) {
  if (!error) {
    error = ""
  }
  if (error.length > 0) {
    error += "\n"
  }
  error += `${newError} ${tables.join(", ")}`
  return error
}

async function getConnector(
  datasource: Datasource
): Promise<IntegrationBase | DatasourcePlus> {
  const Connector = await getIntegration(datasource.source)
  // can't enrich if it doesn't have an ID yet
  if (datasource._id) {
    datasource = await sdk.datasources.enrich(datasource)
  }
  // Connect to the DB and build the schema
  return new Connector(datasource.config)
}

async function getAndMergeDatasource(datasource: Datasource) {
  let existingDatasource: undefined | Datasource
  if (datasource._id) {
    existingDatasource = await sdk.datasources.get(datasource._id)
  }
  let enrichedDatasource = datasource
  if (existingDatasource) {
    enrichedDatasource = sdk.datasources.mergeConfigs(
      datasource,
      existingDatasource
    )
  }
  return await sdk.datasources.enrich(enrichedDatasource)
}

async function buildSchemaHelper(datasource: Datasource) {
  const connector = (await getConnector(datasource)) as DatasourcePlus
  await connector.buildSchema(datasource._id!, datasource.entities!)

  const errors = connector.schemaErrors
  let error = null
  if (errors && Object.keys(errors).length > 0) {
    const noKey = getErrorTables(errors, BuildSchemaErrors.NO_KEY)
    const invalidCol = getErrorTables(errors, BuildSchemaErrors.INVALID_COLUMN)
    if (noKey.length) {
      error = updateError(
        error,
        "No primary key constraint found for the following:",
        noKey
      )
    }
    if (invalidCol.length) {
      const invalidCols = Object.values(InvalidColumns).join(", ")
      error = updateError(
        error,
        `Cannot use columns ${invalidCols} found in following:`,
        invalidCol
      )
    }
  }
  return { tables: connector.tables, error }
}

export async function fetch(ctx: UserCtx) {
  // Get internal tables
  const db = context.getAppDB()
  const internalTables = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )

  const internal = internalTables.rows.reduce((acc: any, row: Row) => {
    const sourceId = row.doc.sourceId || "bb_internal"
    acc[sourceId] = acc[sourceId] || []
    acc[sourceId].push(row.doc)
    return acc
  }, {})

  const bbInternalDb = {
    ...BudibaseInternalDB,
  }

  // Get external datasources
  const datasources = (
    await db.allDocs(
      getDatasourceParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)

  const allDatasources: Datasource[] = await sdk.datasources.removeSecrets([
    bbInternalDb,
    ...datasources,
  ])

  for (let datasource of allDatasources) {
    if (datasource.type === dbCore.BUDIBASE_DATASOURCE_TYPE) {
      datasource.entities = internal[datasource._id!]
    }
  }

  ctx.body = [bbInternalDb, ...datasources]
}

export async function verify(
  ctx: UserCtx<VerifyDatasourceRequest, VerifyDatasourceResponse>
) {
  const { datasource } = ctx.request.body
  const enrichedDatasource = await getAndMergeDatasource(datasource)
  const connector = await getConnector(enrichedDatasource)
  if (!connector.testConnection) {
    ctx.throw(400, "Connection information verification not supported")
  }
  const response = await connector.testConnection()

  ctx.body = {
    connected: response.connected,
    error: response.error,
  }
}

export async function information(
  ctx: UserCtx<FetchDatasourceInfoRequest, FetchDatasourceInfoResponse>
) {
  const { datasource } = ctx.request.body
  const enrichedDatasource = await getAndMergeDatasource(datasource)
  const connector = (await getConnector(enrichedDatasource)) as DatasourcePlus
  if (!connector.getTableNames) {
    ctx.throw(400, "Table name fetching not supported by datasource")
  }
  const tableNames = await connector.getTableNames()
  ctx.body = {
    tableNames,
  }
}

export async function buildSchemaFromDb(ctx: UserCtx) {
  const db = context.getAppDB()
  const datasource = await sdk.datasources.get(ctx.params.datasourceId)
  const tablesFilter = ctx.request.body.tablesFilter

  let { tables, error } = await buildSchemaHelper(datasource)
  if (tablesFilter) {
    if (!datasource.entities) {
      datasource.entities = {}
    }
    for (let key in tables) {
      if (
        tablesFilter.some(
          (filter: any) => filter.toLowerCase() === key.toLowerCase()
        )
      ) {
        datasource.entities[key] = tables[key]
      }
    }
  } else {
    datasource.entities = tables
  }

  setDefaultDisplayColumns(datasource)
  const dbResp = await db.put(datasource)
  datasource._rev = dbResp.rev
  const cleanedDatasource = await sdk.datasources.removeSecretSingle(datasource)

  const response: any = { datasource: cleanedDatasource }
  if (error) {
    response.error = error
  }
  ctx.body = response
}

/**
 * Make sure all datasource entities have a display name selected
 */
function setDefaultDisplayColumns(datasource: Datasource) {
  //
  for (let entity of Object.values(datasource.entities || {})) {
    if (entity.primaryDisplay) {
      continue
    }
    const notAutoColumn = Object.values(entity.schema).find(
      schema => !schema.autocolumn
    )
    if (notAutoColumn) {
      entity.primaryDisplay = notAutoColumn.name
    }
  }
}

/**
 * Check for variables that have been updated or removed and invalidate them.
 */
async function invalidateVariables(
  existingDatasource: Datasource,
  updatedDatasource: Datasource
) {
  const existingVariables: any = existingDatasource.config?.dynamicVariables
  const updatedVariables: any = updatedDatasource.config?.dynamicVariables
  const toInvalidate = []

  if (!existingVariables) {
    return
  }

  if (!updatedVariables) {
    // invalidate all
    toInvalidate.push(...existingVariables)
  } else {
    // invaldate changed / removed
    existingVariables.forEach((existing: any) => {
      const unchanged = updatedVariables.find(
        (updated: any) =>
          existing.name === updated.name &&
          existing.queryId === updated.queryId &&
          existing.value === updated.value
      )
      if (!unchanged) {
        toInvalidate.push(existing)
      }
    })
  }
  await invalidateDynamicVariables(toInvalidate)
}

export async function update(ctx: UserCtx<any, UpdateDatasourceResponse>) {
  const db = context.getAppDB()
  const datasourceId = ctx.params.datasourceId
  let datasource = await sdk.datasources.get(datasourceId)
  const auth = datasource.config?.auth
  await invalidateVariables(datasource, ctx.request.body)

  const isBudibaseSource = datasource.type === dbCore.BUDIBASE_DATASOURCE_TYPE

  const dataSourceBody = isBudibaseSource
    ? { name: ctx.request.body?.name }
    : ctx.request.body

  datasource = {
    ...datasource,
    ...sdk.datasources.mergeConfigs(dataSourceBody, datasource),
  }
  if (auth && !ctx.request.body.auth) {
    // don't strip auth config from DB
    datasource.config!.auth = auth
  }

  const response = await db.put(datasource)
  await events.datasource.updated(datasource)
  datasource._rev = response.rev

  // Drain connection pools when configuration is changed
  if (datasource.source && !isBudibaseSource) {
    const source = await getIntegration(datasource.source)
    if (source && source.pool) {
      await source.pool.end()
    }
  }

  ctx.status = 200
  ctx.message = "Datasource saved successfully."
  ctx.body = {
    datasource: await sdk.datasources.removeSecretSingle(datasource),
  }
  builderSocket?.emitDatasourceUpdate(ctx, datasource)
}

export async function save(
  ctx: UserCtx<CreateDatasourceRequest, CreateDatasourceResponse>
) {
  const db = context.getAppDB()
  const plus = ctx.request.body.datasource.plus
  const fetchSchema = ctx.request.body.fetchSchema

  const datasource = {
    _id: generateDatasourceID({ plus }),
    ...ctx.request.body.datasource,
    type: plus ? DocumentType.DATASOURCE_PLUS : DocumentType.DATASOURCE,
  }

  let schemaError = null
  if (fetchSchema) {
    const { tables, error } = await buildSchemaHelper(datasource)
    schemaError = error
    datasource.entities = tables
    setDefaultDisplayColumns(datasource)
  }

  const dbResp = await db.put(datasource)
  await events.datasource.created(datasource)
  datasource._rev = dbResp.rev

  // Drain connection pools when configuration is changed
  if (datasource.source) {
    const source = await getIntegration(datasource.source)
    if (source && source.pool) {
      await source.pool.end()
    }
  }

  const response: CreateDatasourceResponse = {
    datasource: await sdk.datasources.removeSecretSingle(datasource),
  }
  if (schemaError) {
    response.error = schemaError
  }
  ctx.body = response
  builderSocket?.emitDatasourceUpdate(ctx, datasource)
}

async function destroyInternalTablesBySourceId(datasourceId: string) {
  const db = context.getAppDB()

  // Get all internal tables
  const internalTables = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )

  // Filter by datasource and return the docs.
  const datasourceTableDocs = internalTables.rows.reduce(
    (acc: any, table: any) => {
      if (table.doc.sourceId == datasourceId) {
        acc.push(table.doc)
      }
      return acc
    },
    []
  )

  // Destroy the tables.
  for (const table of datasourceTableDocs) {
    await tableDestroy({
      params: {
        tableId: table._id,
      },
    })
  }
}

export async function destroy(ctx: UserCtx) {
  const db = context.getAppDB()
  const datasourceId = ctx.params.datasourceId

  const datasource = await sdk.datasources.get(datasourceId)
  // Delete all queries for the datasource

  if (datasource.type === dbCore.BUDIBASE_DATASOURCE_TYPE) {
    await destroyInternalTablesBySourceId(datasourceId)
  } else {
    const queries = await db.allDocs(getQueryParams(datasourceId, null))
    await db.bulkDocs(
      queries.rows.map((row: any) => ({
        _id: row.id,
        _rev: row.value.rev,
        _deleted: true,
      }))
    )
  }

  // delete the datasource
  await db.remove(datasourceId, ctx.params.revId)
  await events.datasource.deleted(datasource)

  ctx.message = `Datasource deleted.`
  ctx.status = 200
  builderSocket?.emitDatasourceDeletion(ctx, datasourceId)
}

export async function find(ctx: UserCtx) {
  const database = context.getAppDB()
  const datasource = await database.get(ctx.params.datasourceId)
  ctx.body = await sdk.datasources.removeSecretSingle(datasource)
}

// dynamic query functionality
export async function query(ctx: UserCtx) {
  const queryJson = ctx.request.body
  try {
    ctx.body = await getDatasourceAndQuery(queryJson)
  } catch (err: any) {
    ctx.throw(400, err)
  }
}
