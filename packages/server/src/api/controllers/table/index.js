const CouchDB = require("../../../db")
const internal = require("./internal")
const external = require("./external")
const csvParser = require("../../../utilities/csvParser")
const { isExternalTable } = require("../../../integrations/utils")
const {
  getTableParams,
  getDatasourceParams,
  BudibaseInternalDB,
} = require("../../../db/utils")
const { getTable } = require("./utils")

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
  const db = new CouchDB(ctx.appId)

  const internalTables = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )

  const internal = internalTables.rows.map(row => ({
    ...row.doc,
    type: "internal",
    sourceId: BudibaseInternalDB._id,
  }))

  const externalTables = await db.allDocs(
    getDatasourceParams("plus", {
      include_docs: true,
    })
  )

  const external = externalTables.rows.flatMap(row => {
    return Object.values(row.doc.entities || {}).map(entity => ({
      ...entity,
      type: "external",
      sourceId: row.doc._id,
    }))
  })

  ctx.body = [...internal, ...external]
}

exports.find = async function (ctx) {
  const tableId = ctx.params.id
  ctx.body = await getTable(ctx.appId, tableId)
}

exports.save = async function (ctx) {
  const appId = ctx.appId
  const table = ctx.request.body
  const savedTable = await pickApi({ table }).save(ctx)
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
  ctx.eventEmitter &&
    ctx.eventEmitter.emitTable(`table:delete`, appId, deletedTable)
  ctx.status = 200
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
    existingTable = await getTable(ctx.appId, tableId)
  }
  let result = await csvParser.parse(csvString, schema)
  if (existingTable) {
    result = csvParser.updateSchema({ schema: result, existingTable })
  }
  ctx.body = { schema: result }
}
