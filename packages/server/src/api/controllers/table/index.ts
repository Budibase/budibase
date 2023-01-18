import * as internal from "./internal"
import * as external from "./external"
import {
  validate as validateSchema,
  isSchema,
  isRows,
} from "../../../utilities/schema"
import { isExternalTable, isSQL } from "../../../integrations/utils"
import { getDatasourceParams } from "../../../db/utils"
import { context, events } from "@budibase/backend-core"
import { Table, BBContext } from "@budibase/types"
import sdk from "../../../sdk"
import csv from "csvtojson"

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
export async function fetch(ctx: BBContext) {
  const db = context.getAppDB()

  const internal = await sdk.tables.getAllInternalTables()

  const externalTables = await db.allDocs(
    getDatasourceParams("plus", {
      include_docs: true,
    })
  )

  const external = externalTables.rows.flatMap(tableDoc => {
    let entities = tableDoc.doc.entities
    if (entities) {
      return Object.values(entities).map((entity: any) => ({
        ...entity,
        type: "external",
        sourceId: tableDoc.doc._id,
        sql: isSQL(tableDoc.doc),
      }))
    } else {
      return []
    }
  })

  ctx.body = [...internal, ...external]
}

export async function find(ctx: BBContext) {
  const tableId = ctx.params.tableId
  ctx.body = await sdk.tables.getTable(tableId)
}

export async function save(ctx: BBContext) {
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
    ctx.eventEmitter.emitTable(`table:save`, appId, savedTable)
  ctx.body = savedTable
}

export async function destroy(ctx: BBContext) {
  const appId = ctx.appId
  const tableId = ctx.params.tableId
  const deletedTable = await pickApi({ tableId }).destroy(ctx)
  await events.table.deleted(deletedTable)
  ctx.eventEmitter &&
    ctx.eventEmitter.emitTable(`table:delete`, appId, deletedTable)
  ctx.status = 200
  ctx.table = deletedTable
  ctx.body = { message: `Table ${tableId} deleted.` }
}

export async function bulkImport(ctx: BBContext) {
  const tableId = ctx.params.tableId
  await pickApi({ tableId }).bulkImport(ctx)
  // right now we don't trigger anything for bulk import because it
  // can only be done in the builder, but in the future we may need to
  // think about events for bulk items
  ctx.status = 200
  ctx.body = { message: `Bulk rows created.` }
}

export async function csvToJson(ctx: BBContext) {
  const { csvString } = ctx.request.body

  const result = await csv().fromString(csvString)

  ctx.status = 200
  ctx.body = result
}

export async function validateNewTableImport(ctx: BBContext) {
  const { rows, schema }: { rows: unknown; schema: unknown } = ctx.request.body

  if (isRows(rows) && isSchema(schema)) {
    ctx.status = 200
    ctx.body = validateSchema(rows, schema)
  } else {
    ctx.status = 422
  }
}

export async function validateExistingTableImport(ctx: BBContext) {
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
