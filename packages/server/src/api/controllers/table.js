const CouchDB = require("../../db")
const linkRecords = require("../../db/linkedRecords")
const csvParser = require("../../utilities/csvParser")
const {
  getRecordParams,
  getTableParams,
  generateTableID,
  generateRecordID,
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

  // if the table obj had an _id then it will have been retrieved
  const oldTable = ctx.preExisting

  // rename record fields when table column is renamed
  const { _rename } = tableToSave
  if (_rename && tableToSave.schema[_rename.updated].type === "link") {
    throw "Cannot rename a linked field."
  } else if (_rename && tableToSave.primaryDisplay === _rename.old) {
    throw "Cannot rename the primary display field."
  } else if (_rename) {
    const records = await db.allDocs(
      getRecordParams(tableToSave._id, null, {
        include_docs: true,
      })
    )

    const docs = records.rows.map(({ doc }) => {
      doc[_rename.updated] = doc[_rename.old]
      delete doc[_rename.old]
      return doc
    })

    await db.bulkDocs(docs)
    delete tableToSave._rename
  }

  // update schema of non-statistics views when new columns are added
  for (let view in tableToSave.views) {
    const tableView = tableToSave.views[view]
    if (!tableView) continue

    if (tableView.schema.group || tableView.schema.field) continue
    tableView.schema = tableToSave.schema
  }

  const result = await db.post(tableToSave)
  tableToSave._rev = result.rev

  // update linked records
  await linkRecords.updateLinks({
    instanceId,
    eventType: oldTable
      ? linkRecords.EventType.TABLE_UPDATED
      : linkRecords.EventType.TABLE_SAVE,
    table: tableToSave,
    oldTable: oldTable,
  })

  ctx.eventEmitter &&
    ctx.eventEmitter.emitTable(`table:save`, instanceId, tableToSave)

  if (dataImport && dataImport.path) {
    // Populate the table with records imported from CSV in a bulk update
    const data = await csvParser.transform(dataImport)

    for (let row of data) {
      row._id = generateRecordID(tableToSave._id)
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

  await db.remove(tableToDelete)

  // Delete all records for that table
  const records = await db.allDocs(
    getRecordParams(ctx.params.tableId, null, {
      include_docs: true,
    })
  )
  await db.bulkDocs(
    records.rows.map(record => ({ _id: record.id, _deleted: true }))
  )

  // update linked records
  await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.TABLE_DELETE,
    table: tableToDelete,
  })

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
