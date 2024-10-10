import * as internal from "./internal"
import * as external from "./external"
import {
  isRows,
  isSchema,
  validate as validateSchema,
} from "../../../utilities/schema"
import {
  isExternalTable,
  isExternalTableID,
  isSQL,
} from "../../../integrations/utils"
import { events, HTTPError } from "@budibase/backend-core"
import {
  BulkImportRequest,
  BulkImportResponse,
  CsvToJsonRequest,
  CsvToJsonResponse,
  FetchTablesResponse,
  FieldType,
  MigrateRequest,
  MigrateResponse,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  TableResponse,
  TableSourceType,
  UserCtx,
  ValidateNewTableImportRequest,
  ValidateTableImportRequest,
  ValidateTableImportResponse,
} from "@budibase/types"
import sdk from "../../../sdk"
import { jsonFromCsvString } from "../../../utilities/csv"
import { builderSocket } from "../../../websockets"
import { cloneDeep } from "lodash"
import {
  helpers,
  PROTECTED_EXTERNAL_COLUMNS,
  PROTECTED_INTERNAL_COLUMNS,
} from "@budibase/shared-core"
import { processTable } from "../../../sdk/app/tables/getters"

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

// covers both internal and external
export async function fetch(ctx: UserCtx<void, FetchTablesResponse>) {
  const internal = await sdk.tables.getAllInternalTables()

  const datasources = await sdk.datasources.getExternalDatasources()

  const external = datasources.flatMap(datasource => {
    let entities = datasource.entities
    if (entities) {
      return Object.values(entities).map<Table>((entity: Table) => ({
        ...entity,
        sourceType: TableSourceType.EXTERNAL,
        sourceId: datasource._id!,
        sql: isSQL(datasource),
      }))
    } else {
      return []
    }
  })

  const result: FetchTablesResponse = []
  for (const table of [...internal, ...external]) {
    result.push(await sdk.tables.enrichViewSchemas(table))
  }
  ctx.body = result
}

export async function find(ctx: UserCtx<void, TableResponse>) {
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

  checkDefaultFields(table)

  let savedTable: Table
  if (isCreate) {
    savedTable = await sdk.tables.create(table, rows, ctx.user._id)
    savedTable = await sdk.tables.enrichViewSchemas(savedTable)
    await events.table.created(savedTable)
  } else {
    const api = pickApi({ table })
    savedTable = await api.updateTable(ctx, renaming)
    await events.table.updated(savedTable)
  }
  if (renaming) {
    await sdk.views.renameLinkedViews(savedTable, renaming)
  }
  if (isImport) {
    await events.table.imported(savedTable)
  }
  ctx.status = 200
  ctx.message = `Table ${table.name} saved successfully.`
  ctx.eventEmitter &&
    ctx.eventEmitter.emitTable(`table:save`, appId, { ...savedTable })
  ctx.body = savedTable

  savedTable = await processTable(savedTable)
  builderSocket?.emitTableUpdate(ctx, cloneDeep(savedTable))
}

export async function destroy(ctx: UserCtx) {
  const appId = ctx.appId
  const tableId = ctx.params.tableId
  await sdk.rowActions.deleteAll(tableId)
  const deletedTable = await pickApi({ tableId }).destroy(ctx)
  await events.table.deleted(deletedTable)
  ctx.eventEmitter &&
    ctx.eventEmitter.emitTable(`table:delete`, appId, deletedTable)
  ctx.status = 200
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

  ctx.status = 200
  ctx.body = { message: `Bulk rows created.` }
}

export async function csvToJson(
  ctx: UserCtx<CsvToJsonRequest, CsvToJsonResponse>
) {
  const { csvString } = ctx.request.body

  const result = await jsonFromCsvString(csvString)

  ctx.status = 200
  ctx.body = result
}

export async function validateNewTableImport(
  ctx: UserCtx<ValidateNewTableImportRequest, ValidateTableImportResponse>
) {
  const { rows, schema } = ctx.request.body

  if (isRows(rows) && isSchema(schema)) {
    ctx.status = 200
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
    ctx.status = 200
    ctx.body = validateSchema(rows, schema, protectedColumnNames)
  } else {
    ctx.status = 422
  }
}

export async function migrate(ctx: UserCtx<MigrateRequest, MigrateResponse>) {
  const { oldColumn, newColumn } = ctx.request.body
  let tableId = ctx.params.tableId as string
  const table = await sdk.tables.getTable(tableId)
  let result = await sdk.tables.migrate(table, oldColumn, newColumn)

  for (let table of result.tablesUpdated) {
    builderSocket?.emitTableUpdate(ctx, table, {
      includeOriginator: true,
    })
  }

  ctx.status = 200
  ctx.body = { message: `Column ${oldColumn} migrated.` }
}
