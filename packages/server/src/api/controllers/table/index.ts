import * as internal from "./internal"
import * as external from "./external"
import * as csvParser from "../../../utilities/csvParser"
import { isExternalTable, isSQL } from "../../../integrations/utils"
import { getDatasourceParams } from "../../../db/utils"
import { context, events } from "@budibase/backend-core"
import { Table, BBContext } from "@budibase/types"
import sdk from "../../../sdk"

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
  const importFormat =
    table.dataImport && table.dataImport.csvString ? "csv" : undefined
  const savedTable = await pickApi({ table }).save(ctx)
  if (!table._id) {
    await events.table.created(savedTable)
  } else {
    await events.table.updated(savedTable)
  }
  if (importFormat) {
    await events.table.imported(savedTable, importFormat)
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

export async function validateCSVSchema(ctx: BBContext) {
  // tableId being specified means its an import to an existing table
  const { csvString, schema = {}, tableId } = ctx.request.body
  let existingTable
  if (tableId) {
    existingTable = await sdk.tables.getTable(tableId)
  }
  let result: Record<string, any> | undefined = await csvParser.parse(
    csvString,
    schema
  )
  if (existingTable) {
    result = csvParser.updateSchema({ schema: result, existingTable })
  }
  ctx.body = { schema: result }
}
