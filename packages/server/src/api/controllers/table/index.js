const internal = require("./internal")
const external = require("./external")
const csvParser = require("../../../utilities/csvParser")
const { isExternalTable, isSQL } = require("../../../integrations/utils")
const { getDatasourceParams } = require("../../../db/utils")
const { getAppDB } = require("@budibase/backend-core/context")
const { events } = require("@budibase/backend-core")
const sdk = require("../../../sdk")

function pickApi({ tableId, table }) {
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
exports.fetch = async function (ctx) {
  const db = getAppDB()

  const internal = await sdk.tables.getAllInternalTables()

  const externalTables = await db.allDocs(
    getDatasourceParams("plus", {
      include_docs: true,
    })
  )

  const external = externalTables.rows.flatMap(tableDoc => {
    let entities = tableDoc.doc.entities
    if (entities) {
      return Object.values(entities).map(entity => ({
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

exports.find = async function (ctx) {
  const tableId = ctx.params.tableId
  ctx.body = await sdk.tables.getTable(tableId)
}

exports.save = async function (ctx) {
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

exports.destroy = async function (ctx) {
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

exports.bulkImport = async function (ctx) {
  const tableId = ctx.params.tableId
  await pickApi({ tableId }).bulkImport(ctx)
  // right now we don't trigger anything for bulk import because it
  // can only be done in the builder, but in the future we may need to
  // think about events for bulk items
  ctx.status = 200
  ctx.body = { message: `Bulk rows created.` }
}

exports.validateCSVSchema = async function (ctx) {
  // tableId being specified means its an import to an existing table
  const { csvString, schema = {}, tableId } = ctx.request.body
  let existingTable
  if (tableId) {
    existingTable = await sdk.tables.getTable(tableId)
  }
  let result = await csvParser.parse(csvString, schema)
  if (existingTable) {
    result = csvParser.updateSchema({ schema: result, existingTable })
  }
  ctx.body = { schema: result }
}
