import { getQueryParams, getTableParams } from "../../db/utils"
import { getIntegration } from "../../integrations"
import { invalidateCachedVariable } from "../../threads/utils"
import { context, db as dbCore, events } from "@budibase/backend-core"
import {
  BuildSchemaFromSourceRequest,
  BuildSchemaFromSourceResponse,
  CreateDatasourceRequest,
  CreateDatasourceResponse,
  Datasource,
  DatasourcePlus,
  Document,
  FetchDatasourceInfoRequest,
  FetchDatasourceInfoResponse,
  FieldType,
  RelationshipFieldMetadata,
  SourceName,
  UpdateDatasourceRequest,
  UpdateDatasourceResponse,
  UserCtx,
  VerifyDatasourceRequest,
  VerifyDatasourceResponse,
  Table,
  RowValue,
  DynamicVariable,
  FetchDatasourcesResponse,
  FindDatasourcesResponse,
  DeleteDatasourceResponse,
  FetchExternalSchemaResponse,
} from "@budibase/types"
import sdk from "../../sdk"
import { builderSocket } from "../../websockets"
import { isEqual } from "lodash"
import { processTable } from "../../sdk/app/tables/getters"

export async function fetch(ctx: UserCtx<void, FetchDatasourcesResponse>) {
  ctx.body = await sdk.datasources.fetch()
}

export async function verify(
  ctx: UserCtx<VerifyDatasourceRequest, VerifyDatasourceResponse>
) {
  const { datasource } = ctx.request.body
  const enrichedDatasource = await sdk.datasources.getAndMergeDatasource(
    datasource
  )
  const connector = await sdk.datasources.getConnector(enrichedDatasource)
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
  const enrichedDatasource = await sdk.datasources.getAndMergeDatasource(
    datasource
  )
  const connector = (await sdk.datasources.getConnector(
    enrichedDatasource
  )) as DatasourcePlus
  if (!connector.getTableNames) {
    ctx.throw(400, "Table name fetching not supported by datasource")
  }
  const tableNames = await connector.getTableNames()
  ctx.body = {
    tableNames: tableNames.sort(),
  }
}

export async function buildSchemaFromSource(
  ctx: UserCtx<BuildSchemaFromSourceRequest, BuildSchemaFromSourceResponse>
) {
  const datasourceId = ctx.params.datasourceId
  const tablesFilter = ctx.request.body.tablesFilter

  const { datasource, errors } = await sdk.datasources.buildSchemaFromSource(
    datasourceId,
    tablesFilter
  )

  ctx.body = {
    datasource: await sdk.datasources.removeSecretSingle(datasource),
    errors,
  }
}

/**
 * Check for variables that have been updated or removed and invalidate them.
 */
async function invalidateVariables(
  existingDatasource: Datasource,
  updatedDatasource: Datasource
) {
  const existingVariables: DynamicVariable[] =
    existingDatasource.config?.dynamicVariables || []
  const updatedVariables: DynamicVariable[] =
    updatedDatasource.config?.dynamicVariables || []
  const toInvalidate = []

  if (!existingVariables) {
    return
  }

  if (!updatedVariables) {
    // invalidate all
    toInvalidate.push(...existingVariables)
  } else {
    // invaldate changed / removed
    existingVariables.forEach(existing => {
      const unchanged = updatedVariables.find(
        updated =>
          existing.name === updated.name &&
          existing.queryId === updated.queryId &&
          existing.value === updated.value
      )
      if (!unchanged) {
        toInvalidate.push(existing)
      }
    })
  }
  await invalidateCachedVariable(toInvalidate)
}

export async function update(
  ctx: UserCtx<UpdateDatasourceRequest, UpdateDatasourceResponse>
) {
  const db = context.getAppDB()
  const datasourceId = ctx.params.datasourceId
  const baseDatasource = await sdk.datasources.get(datasourceId)
  await invalidateVariables(baseDatasource, ctx.request.body)

  const isBudibaseSource =
    baseDatasource.type === dbCore.BUDIBASE_DATASOURCE_TYPE

  const dataSourceBody: Datasource = isBudibaseSource
    ? {
        name: ctx.request.body?.name,
        type: dbCore.BUDIBASE_DATASOURCE_TYPE,
        source: SourceName.BUDIBASE,
      }
    : ctx.request.body

  let datasource: Datasource = {
    ...baseDatasource,
    ...sdk.datasources.mergeConfigs(dataSourceBody, baseDatasource),
  }

  // this block is specific to GSheets, if no auth set, set it back
  const auth = baseDatasource.config?.auth
  if (auth && !ctx.request.body.auth) {
    // don't strip auth config from DB
    datasource.config!.auth = auth
  }

  // check all variables are unique
  if (
    datasource.source === SourceName.REST &&
    !sdk.datasources.areRESTVariablesValid(datasource)
  ) {
    ctx.throw(400, "Duplicate dynamic/static variable names are invalid.")
  }

  const response = await db.put(
    sdk.tables.populateExternalTableSchemas(datasource)
  )
  await events.datasource.updated(datasource)
  datasource._rev = response.rev

  // Drain connection pools when configuration is changed
  if (datasource.source && !isBudibaseSource) {
    const source = await getIntegration(datasource.source)
    if (source && source.pool) {
      await source.pool.end()
    }
  }

  ctx.message = "Datasource saved successfully."
  ctx.body = {
    datasource: await sdk.datasources.removeSecretSingle(datasource),
  }
  builderSocket?.emitDatasourceUpdate(ctx, datasource)
  // send table updates if they have occurred
  if (datasource.entities) {
    for (let table of Object.values(datasource.entities)) {
      const oldTable = baseDatasource.entities?.[table.name]
      if (!oldTable || !isEqual(oldTable, table)) {
        table = await processTable(table)
        builderSocket?.emitTableUpdate(ctx, table, { includeOriginator: true })
      }
    }
  }
}

export async function save(
  ctx: UserCtx<CreateDatasourceRequest, CreateDatasourceResponse>
) {
  const {
    datasource: datasourceData,
    fetchSchema,
    tablesFilter,
  } = ctx.request.body
  const { datasource, errors } = await sdk.datasources.save(datasourceData, {
    fetchSchema,
    tablesFilter,
  })

  ctx.body = {
    datasource: await sdk.datasources.removeSecretSingle(datasource),
    errors,
  }
  builderSocket?.emitDatasourceUpdate(ctx, datasource)
}

async function destroyInternalTablesBySourceId(datasourceId: string) {
  const db = context.getAppDB()

  // Get all internal tables
  const internalTables = await db.allDocs<Table>(
    getTableParams(null, {
      include_docs: true,
    })
  )

  // Filter by datasource and return the docs.
  const datasourceTableDocs = internalTables.rows.reduce(
    (acc: Table[], table) => {
      if (table.doc?.sourceId == datasourceId) {
        acc.push(table.doc)
      }
      return acc
    },
    []
  )

  function updateRevisions(deletedLinks: RelationshipFieldMetadata[]) {
    for (const link of deletedLinks) {
      datasourceTableDocs.forEach((doc: Document) => {
        if (doc._id === link.tableId) {
          doc._rev = link.tableRev
        }
      })
    }
  }

  // Destroy the tables.
  for (const table of datasourceTableDocs) {
    const deleted = await sdk.tables.internal.destroy(table)
    // Update the revisions of any tables that remain to be deleted
    const deletedLinks: RelationshipFieldMetadata[] = Object.values(
      deleted.table.schema
    )
      .filter(field => field.type === FieldType.LINK)
      .map(field => field as RelationshipFieldMetadata)
    updateRevisions(deletedLinks)
  }
}

export async function destroy(ctx: UserCtx<void, DeleteDatasourceResponse>) {
  const db = context.getAppDB()
  const datasourceId = ctx.params.datasourceId

  const datasource = await sdk.datasources.get(datasourceId)
  // Delete all queries for the datasource

  await sdk.rowActions.deleteAllForDatasource(datasourceId)

  if (datasource.type === dbCore.BUDIBASE_DATASOURCE_TYPE) {
    await destroyInternalTablesBySourceId(datasourceId)
  } else {
    const queries = await db.allDocs<RowValue>(getQueryParams(datasourceId))
    await db.bulkDocs(
      queries.rows.map(row => ({
        _id: row.id,
        _rev: row.value.rev,
        _deleted: true,
      }))
    )
  }

  // delete the datasource
  await db.remove(datasourceId, ctx.params.revId)
  await events.datasource.deleted(datasource)

  ctx.body = { message: `Datasource deleted.` }
  builderSocket?.emitDatasourceDeletion(ctx, datasourceId)
}

export async function find(ctx: UserCtx<void, FindDatasourcesResponse>) {
  const datasource = await sdk.datasources.get(ctx.params.datasourceId)
  ctx.body = await sdk.datasources.removeSecretSingle(datasource)
}

export async function getExternalSchema(
  ctx: UserCtx<void, FetchExternalSchemaResponse>
) {
  const datasource = await sdk.datasources.get(ctx.params.datasourceId)
  const enrichedDatasource = await sdk.datasources.getAndMergeDatasource(
    datasource
  )
  const connector = await sdk.datasources.getConnector(enrichedDatasource)

  if (!connector.getExternalSchema) {
    ctx.throw(400, "Datasource does not support exporting external schema")
  }

  try {
    ctx.body = { schema: await connector.getExternalSchema() }
  } catch (e: any) {
    ctx.throw(400, e.message)
  }
}
