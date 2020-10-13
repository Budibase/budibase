const CouchDB = require("../../db")
const linkRows = require("../../db/linkedRows")
const csvParser = require("../../utilities/csvParser")
const {
  getRowParams,
  getTableParams,
  generateTableID,
  generateRowID,
} = require("../../db/utils")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const body = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )
  ctx.body = body.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  ctx.body = await db.get(ctx.params.id)
}

exports.save = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const { dataImport, ...rest } = ctx.request.body
  const tableToSave = {
    type: "table",
    _id: generateTableID(),
    views: {},
    ...rest,
  }
  let renameDocs = []

  // if the table obj had an _id then it will have been retrieved
  const oldTable = ctx.preExisting

  // rename row fields when table column is renamed
  const { _rename } = tableToSave
  if (_rename && tableToSave.schema[_rename.updated].type === "link") {
    throw "Cannot rename a linked field."
  } else if (_rename && tableToSave.primaryDisplay === _rename.old) {
    throw "Cannot rename the primary display field."
  } else if (_rename) {
    const rows = await db.allDocs(
      getRowParams(tableToSave._id, null, {
        include_docs: true,
      })
    )
    renameDocs = rows.rows.map(({ doc }) => {
      doc[_rename.updated] = doc[_rename.old]
      delete doc[_rename.old]
      return doc
    })
    delete tableToSave._rename
  }

  // update schema of non-statistics views when new columns are added
  for (let view in tableToSave.views) {
    const tableView = tableToSave.views[view]
    if (!tableView) continue

    if (tableView.schema.group || tableView.schema.field) continue
    tableView.schema = tableToSave.schema
  }

  // update linked rows
  await linkRows.updateLinks({
    instanceId,
    eventType: oldTable
      ? linkRows.EventType.TABLE_UPDATED
      : linkRows.EventType.TABLE_SAVE,
    table: tableToSave,
    oldTable: oldTable,
  })

  // don't perform any updates until relationships have been
  // checked by the updateLinks function
  if (renameDocs.length !== 0) {
    await db.bulkDocs(renameDocs)
  }
  const result = await db.post(tableToSave)
  tableToSave._rev = result.rev

  ctx.eventEmitter &&
    ctx.eventEmitter.emitTable(`table:save`, instanceId, tableToSave)

  if (dataImport && dataImport.path) {
    // Populate the table with rows imported from CSV in a bulk update
    const data = await csvParser.transform(dataImport)

    for (let row of data) {
      row._id = generateRowID(tableToSave._id)
      row.tableId = tableToSave._id
    }

    await db.bulkDocs(data)
  }

  ctx.status = 200
  ctx.message = `Table ${ctx.request.body.name} saved successfully.`
  ctx.body = tableToSave
}

exports.destroy = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const tableToDelete = await db.get(ctx.params.tableId)

  // Delete all rows for that table
  const rows = await db.allDocs(
    getRowParams(ctx.params.tableId, null, {
      include_docs: true,
    })
  )
  await db.bulkDocs(rows.rows.map(row => ({ ...row.doc, _deleted: true })))

  // update linked rows
  await linkRows.updateLinks({
    instanceId,
    eventType: linkRows.EventType.TABLE_DELETE,
    table: tableToDelete,
  })

  // don't remove the table itself until very end
  await db.remove(tableToDelete)

  ctx.eventEmitter &&
    ctx.eventEmitter.emitTable(`table:delete`, instanceId, tableToDelete)
  ctx.status = 200
  ctx.message = `Table ${ctx.params.tableId} deleted.`
}

exports.validateCSVSchema = async function(ctx) {
  const { file, schema = {} } = ctx.request.body
  const result = await csvParser.parse(file.path, schema)
  ctx.body = {
    schema: result,
    path: file.path,
  }
}
