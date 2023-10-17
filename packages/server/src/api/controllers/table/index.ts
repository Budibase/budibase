import * as internal from "./internal"
import * as external from "./external"
import {
  isRows,
  isSchema,
  validate as validateSchema,
} from "../../../utilities/schema"
import { isExternalTable, isSQL } from "../../../integrations/utils"
import { events } from "@budibase/backend-core"
import {
  BulkImportRequest,
  BulkImportResponse,
  FetchTablesResponse,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  TableResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import { jsonFromCsvString } from "../../../utilities/csv"
import { builderSocket } from "../../../websockets"
import { cloneDeep, isEqual } from "lodash"

function pickApi({ tableId, table }: { tableId?: string; table?: Table }) {
  if (table && !tableId) {
    tableId = table._id
  }
  if (table && table.type === "external") {
    return external
  } else if (tableId && isExternalTable(tableId)) {
    return external
  }
  return internal
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
        type: "external",
        sourceId: datasource._id,
        sql: isSQL(datasource),
      }))
    } else {
      return []
    }
  })

  ctx.body = [...internal, ...external].map(sdk.tables.enrichViewSchemas)
}

export async function find(ctx: UserCtx<void, TableResponse>) {
  const tableId = ctx.params.tableId
  const table = await sdk.tables.getTable(tableId)

  ctx.body = sdk.tables.enrichViewSchemas(table)
}

export async function save(ctx: UserCtx<SaveTableRequest, SaveTableResponse>) {
  const appId = ctx.appId
  const table = ctx.request.body
  const isImport = table.rows

  const savedTable = await pickApi({ table }).save(ctx)
  if (!table._id) {
    await events.table.created(savedTable)
  } else {
    await events.table.updated(savedTable)
  }
  if (isImport) {
    await events.table.imported(savedTable)
  }
  ctx.status = 200
  ctx.message = `Table ${table.name} saved successfully.`
  ctx.eventEmitter &&
    ctx.eventEmitter.emitTable(`table:save`, appId, { ...savedTable })
  ctx.body = savedTable
  builderSocket?.emitTableUpdate(ctx, cloneDeep(savedTable))
}

export async function destroy(ctx: UserCtx) {
  const appId = ctx.appId
  const tableId = ctx.params.tableId
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
  let tableBefore = await sdk.tables.getTable(tableId)
  let tableAfter = await pickApi({ tableId }).bulkImport(ctx)

  if (!isEqual(tableBefore, tableAfter)) {
    await sdk.tables.saveTable(tableAfter)
  }

  // right now we don't trigger anything for bulk import because it
  // can only be done in the builder, but in the future we may need to
  // think about events for bulk items

  ctx.status = 200
  ctx.body = { message: `Bulk rows created.` }
}

export async function csvToJson(ctx: UserCtx) {
  const { csvString } = ctx.request.body

  const result = await jsonFromCsvString(csvString)

  ctx.status = 200
  ctx.body = result
}

export async function validateNewTableImport(ctx: UserCtx) {
  const { rows, schema }: { rows: unknown; schema: unknown } = ctx.request.body

  if (isRows(rows) && isSchema(schema)) {
    ctx.status = 200
    ctx.body = validateSchema(rows, schema)
  } else {
    ctx.status = 422
  }
}

export async function validateExistingTableImport(ctx: UserCtx) {
  const { rows, tableId }: { rows: unknown; tableId: unknown } =
    ctx.request.body

  let schema = null
  if (tableId) {
    const table = await sdk.tables.getTable(tableId)
    schema = table.schema
  } else {
    ctx.status = 422
    return
  }

  if (tableId && isRows(rows) && isSchema(schema)) {
    ctx.status = 200
    ctx.body = validateSchema(rows, schema)
  } else {
    ctx.status = 422
  }
}
