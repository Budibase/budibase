import {
  cache,
  context,
  db as dbCore,
  csv,
  events,
  HTTPError,
} from "@budibase/backend-core"
import {
  canBeDisplayColumn,
  helpers,
  PROTECTED_EXTERNAL_COLUMNS,
  PROTECTED_INTERNAL_COLUMNS,
} from "@budibase/shared-core"
import {
  BulkImportRequest,
  BulkImportResponse,
  CsvToJsonRequest,
  CsvToJsonResponse,
  DeleteTableResponse,
  EventType,
  FetchTablesResponse,
  FieldType,
  FindTableResponse,
  MigrateTableRequest,
  MigrateTableResponse,
  PublishTableRequest,
  PublishTableResponse,
  DocumentType,
  SEPARATOR,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  TableSourceType,
  UserCtx,
  ValidateNewTableImportRequest,
  ValidateTableImportRequest,
  ValidateTableImportResponse,
  Row,
} from "@budibase/types"
import { cloneDeep } from "lodash"
import {
  isExternalTable,
  isExternalTableID,
  isSQL,
} from "../../../integrations/utils"
import sdk from "../../../sdk"
import { processTable } from "../../../sdk/workspace/tables/getters"
import { publishWorkspaceInternal } from "../deploy"
import {
  isRows,
  isSchema,
  validate as validateSchema,
} from "../../../utilities/schema"
import { handleDataImport } from "./utils"
import { builderSocket } from "../../../websockets"
import * as external from "./external"
import * as internal from "./internal"
import { getRowParams } from "../../../db/utils"

function pickApi({ tableId, table }: { tableId?: string; table?: Table }) {
  if (table && isExternalTable(table)) {
    return external
  }
  if (tableId && isExternalTableID(tableId)) {
    return external
  }
  return internal
}

function checkDefaultFields(table: Table) {
  for (const [key, field] of Object.entries(table.schema)) {
    if (!("default" in field) || field.default == null) {
      continue
    }
    if (helpers.schema.isRequired(field.constraints)) {
      throw new HTTPError(
        `Cannot make field "${key}" required, it has a default value.`,
        400
      )
    }
  }
}

function stripIgnoreTimezoneSuffix(rows: Row[], table: Table): Row[] {
  const columns = Object.entries(table.schema)
    .filter(
      ([_, schema]) =>
        schema.type === FieldType.DATETIME &&
        schema.ignoreTimezones &&
        !schema.timeOnly
    )
    .map(([name]) => name)
  if (!columns.length) {
    return rows
  }
  return rows.map(row => {
    const updates = columns.reduce<Row>((acc, column) => {
      const value = row[column]
      if (typeof value === "string" && value.endsWith("Z")) {
        acc[column] = value.slice(0, -1)
      }
      return acc
    }, {})
    return Object.keys(updates).length ? { ...row, ...updates } : row
  })
}

async function guardTable(table: Table, isCreate: boolean) {
  checkDefaultFields(table)

  if (
    table.primaryDisplay &&
    !canBeDisplayColumn(table.schema[table.primaryDisplay]?.type)
  ) {
    // Prevent throwing errors from existing badly configured tables. Only throw for new tables or if this setting is being updated
    if (
      isCreate ||
      (await sdk.tables.getTable(table._id!)).primaryDisplay !==
        table.primaryDisplay
    ) {
      throw new HTTPError(
        `Column "${table.primaryDisplay}" cannot be used as a display type.`,
        400
      )
    }
  }
}

// covers both internal and external
export async function fetch(ctx: UserCtx<void, FetchTablesResponse>) {
  const internal = await sdk.tables.getAllInternalTables()

  const datasources = await sdk.datasources.getExternalDatasources()

  const external: Table[] = []
  for (const datasource of datasources) {
    let entities = datasource.entities
    if (entities) {
      for (const entity of Object.values(entities)) {
        external.push({
          ...(await processTable(entity)),
          sourceType: TableSourceType.EXTERNAL,
          sourceId: datasource._id!,
          sql: isSQL(datasource),
        })
      }
    }
  }

  const result: FetchTablesResponse = []
  for (const table of [...internal, ...external]) {
    result.push(await sdk.tables.enrichViewSchemas(table))
  }
  ctx.body = result
}

export async function find(ctx: UserCtx<void, FindTableResponse>) {
  const tableId = ctx.params.tableId
  const table = await sdk.tables.getTable(tableId)

  const result = await sdk.tables.enrichViewSchemas(table)
  ctx.body = result
}

export async function save(ctx: UserCtx<SaveTableRequest, SaveTableResponse>) {
  const appId = ctx.appId
  const { rows, ...table } = ctx.request.body
  const isImport = rows
  const renaming = ctx.request.body._rename

  const isCreate = !table._id

  await guardTable(table, isCreate)

  let savedTable: Table
  if (isCreate) {
    savedTable = await sdk.tables.create(table, rows, ctx.user._id)
    savedTable = await sdk.tables.enrichViewSchemas(savedTable)
    savedTable = await processTable(savedTable)
    await events.table.created(savedTable)
  } else {
    const api = pickApi({ table })
    const { table: updatedTable, oldTable } = await api.updateTable(
      ctx,
      renaming
    )
    savedTable = updatedTable
    savedTable = await processTable(savedTable)

    if (oldTable) {
      await events.table.updated(oldTable, savedTable)
    }
  }
  if (renaming) {
    await sdk.views.renameLinkedViews(savedTable, renaming)
  }
  if (isImport) {
    await events.table.imported(savedTable)
  }
  ctx.message = `Table ${table.name} saved successfully.`
  ctx.eventEmitter?.emitTable(EventType.TABLE_SAVE, appId, { ...savedTable })

  ctx.body = savedTable
  builderSocket?.emitTableUpdate(ctx, cloneDeep(savedTable))
}

export async function destroy(ctx: UserCtx<void, DeleteTableResponse>) {
  const appId = ctx.appId
  const tableId = ctx.params.tableId
  await sdk.rowActions.deleteAll(tableId)
  const deletedTable = await pickApi({ tableId }).destroy(ctx)
  await events.table.deleted(deletedTable, appId)

  ctx.eventEmitter?.emitTable(EventType.TABLE_DELETE, appId, deletedTable)
  ctx.table = deletedTable
  ctx.body = { message: `Table ${tableId} deleted.` }
  builderSocket?.emitTableDeletion(ctx, deletedTable)
}

export async function bulkImport(
  ctx: UserCtx<BulkImportRequest, BulkImportResponse>
) {
  const tableId = ctx.params.tableId
  await pickApi({ tableId }).bulkImport(ctx)

  // right now we don't trigger anything for bulk import because it
  // can only be done in the builder, but in the future we may need to
  // think about events for bulk items

  ctx.body = { message: `Bulk rows created.` }
}

export async function csvToJson(
  ctx: UserCtx<CsvToJsonRequest, CsvToJsonResponse>
) {
  const { csvString } = ctx.request.body

  const result = await csv.jsonFromCsvString(csvString)

  ctx.body = result
}

export async function validateNewTableImport(
  ctx: UserCtx<ValidateNewTableImportRequest, ValidateTableImportResponse>
) {
  const { rows, schema } = ctx.request.body

  if (isRows(rows) && isSchema(schema)) {
    ctx.body = validateSchema(rows, schema, PROTECTED_INTERNAL_COLUMNS)
  } else {
    ctx.status = 422
  }
}

export async function validateExistingTableImport(
  ctx: UserCtx<ValidateTableImportRequest, ValidateTableImportResponse>
) {
  const { rows, tableId } = ctx.request.body

  let schema = null

  let protectedColumnNames
  if (tableId) {
    const table = await sdk.tables.getTable(tableId)
    schema = table.schema

    if (!isExternalTable(table)) {
      schema._id = {
        name: "_id",
        type: FieldType.STRING,
      }
      protectedColumnNames = PROTECTED_INTERNAL_COLUMNS.filter(x => x !== "_id")
    } else {
      protectedColumnNames = PROTECTED_EXTERNAL_COLUMNS
    }
  } else {
    ctx.status = 422
    return
  }

  if (tableId && isRows(rows) && isSchema(schema)) {
    ctx.body = validateSchema(rows, schema, protectedColumnNames)
  } else {
    ctx.status = 422
  }
}

export async function migrate(
  ctx: UserCtx<MigrateTableRequest, MigrateTableResponse>
) {
  const { oldColumn, newColumn } = ctx.request.body
  let tableId = ctx.params.tableId as string
  const table = await sdk.tables.getTable(tableId)
  let result = await sdk.tables.migrate(table, oldColumn, newColumn)

  for (let table of result.tablesUpdated) {
    builderSocket?.emitTableUpdate(ctx, table, {
      includeOriginator: true,
    })
  }

  ctx.body = { message: `Column ${oldColumn} migrated.` }
}

export async function duplicate(ctx: UserCtx<void, SaveTableResponse>) {
  const tableId = ctx.params.tableId as string
  const table = await sdk.tables.getTable(tableId)

  if (isExternalTable(table)) {
    throw new HTTPError("Cannot duplicate external tables", 422)
  }

  const duplicatedTable = await sdk.tables.duplicate(table, ctx.user._id)

  ctx.message = `Table ${table.name} duplicated successfully.`
  ctx.body = duplicatedTable

  const processedTable = await processTable(duplicatedTable)
  builderSocket?.emitTableUpdate(ctx, cloneDeep(processedTable))
}

export async function publish(
  ctx: UserCtx<PublishTableRequest, PublishTableResponse>
) {
  const tableId = ctx.params.tableId as string
  const table = await sdk.tables.getTable(tableId)

  if (!table) {
    ctx.throw(404, "Table not found")
  }

  if (isExternalTable(table)) {
    ctx.throw(
      400,
      "Publishing production data is only supported for internal tables"
    )
  }

  const appId = context.getWorkspaceId()!
  const prodWorkspaceId = dbCore.getProdWorkspaceID(appId)
  const prodPublished =
    await sdk.workspaces.isWorkspacePublished(prodWorkspaceId)

  const seedProductionTables = !!ctx.request.body?.seedProductionTables
  if (!prodPublished) {
    await publishWorkspaceInternal(ctx, seedProductionTables, [tableId])
  }

  if (seedProductionTables) {
    try {
      const devDb = context.getWorkspaceDB()
      const devRows = await devDb.allDocs(
        getRowParams(tableId, null, {
          include_docs: true,
        })
      )
      const importRows = devRows.rows
        .map(({ doc }: any) => doc)
        .filter(doc => doc && !doc._deleted)
        .map(doc => {
          const { _rev, _attachments, ...rest } = doc
          return rest
        })

      if (importRows.length) {
        await context.doInWorkspaceContext(prodWorkspaceId, async () => {
          const prodDb = context.getWorkspaceDB()
          const existingProdRows = await prodDb.allDocs(
            getRowParams(tableId, null, {
              include_docs: true,
              limit: 1,
            })
          )
          const hasProdRows = existingProdRows.rows.some(
            (row: any) => row.doc && !row.doc._deleted
          )
          if (hasProdRows) {
            return
          }

          const prodTable = await sdk.tables.getTable(tableId)
          const sanitizedRows = stripIgnoreTimezoneSuffix(importRows, prodTable)
          await handleDataImport(prodTable, {
            importRows: sanitizedRows,
            userId: ctx.user._id,
            identifierFields: ["_id"],
          })
        })
      }
    } catch (error) {
      console.warn(
        `Failed to copy dev rows to prod for table ${tableId}`,
        error
      )
    }
  }
  const tableSegment = `${SEPARATOR}${tableId}${SEPARATOR}`
  const matchesTable = (_id: string) =>
    _id === tableId ||
    _id.endsWith(`${SEPARATOR}${tableId}`) ||
    _id.includes(tableSegment)
  const isDataDoc = (_id: string) =>
    _id.startsWith(`${DocumentType.ROW}${SEPARATOR}`) ||
    _id.startsWith(`${DocumentType.LINK}${SEPARATOR}`)

  const replication = new dbCore.Replication({
    source: dbCore.getDevWorkspaceID(appId),
    target: prodWorkspaceId,
  })

  await replication.resolveInconsistencies([tableId])

  await replication.replicate(
    replication.appReplicateOpts({
      tablesToSync: undefined,
      checkpoint: false,
      filter: (doc: any) => {
        const _id = doc?._id as string
        if (!_id || _id.startsWith("_design")) {
          return false
        }
        if (_id.startsWith(DocumentType.AUTOMATION_LOG)) {
          return false
        }
        if (_id.startsWith(DocumentType.WORKSPACE_METADATA)) {
          return false
        }
        if (!matchesTable(_id)) {
          return false
        }
        if (!seedProductionTables && isDataDoc(_id)) {
          return false
        }
        return true
      },
    })
  )

  const metadata = await sdk.workspaces.metadata.tryGet({
    production: true,
  })

  if (!metadata?._id) {
    ctx.throw(
      400,
      "Production workspace metadata missing. Please publish the workspace first."
    )
  }

  metadata.resourcesPublishedAt = {
    ...metadata.resourcesPublishedAt,
    [tableId]: new Date().toISOString(),
  }

  const prodDb = context.getProdWorkspaceDB()
  await prodDb.put(metadata)
  await cache.workspace.invalidateWorkspaceMetadata(prodWorkspaceId)

  ctx.body = {
    tableId,
    publishedAt: metadata.resourcesPublishedAt[tableId],
  }
}
