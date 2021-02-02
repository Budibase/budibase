const CouchDB = require("../../db")
const linkRows = require("../../db/linkedRows")
const csvParser = require("../../utilities/csvParser")
const {
  getRowParams,
  getTableParams,
  generateTableID,
  generateRowID,
} = require("../../db/utils")

async function checkForColumnUpdates(db, oldTable, updatedTable) {
  let updatedRows
  const rename = updatedTable._rename
  let deletedColumns = []
  if (oldTable && oldTable.schema && updatedTable.schema) {
    deletedColumns = Object.keys(oldTable.schema).filter(
      colName => updatedTable.schema[colName] == null
    )
  }
  // check for renaming of columns or deleted columns
  if (rename || deletedColumns.length !== 0) {
    const rows = await db.allDocs(
      getRowParams(updatedTable._id, null, {
        include_docs: true,
      })
    )
    updatedRows = rows.rows.map(({ doc }) => {
      if (rename) {
        doc[rename.updated] = doc[rename.old]
        delete doc[rename.old]
      } else if (deletedColumns.length !== 0) {
        deletedColumns.forEach(colName => delete doc[colName])
      }
      return doc
    })
    delete updatedTable._rename
  }
  return updatedRows
}

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const body = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )
  ctx.body = body.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  ctx.body = await db.get(ctx.params.id)
}

exports.save = async function(ctx) {
  const appId = ctx.user.appId
  const db = new CouchDB(appId)
  const { dataImport, ...rest } = ctx.request.body
  const tableToSave = {
    type: "table",
    _id: generateTableID(),
    views: {},
    ...rest,
  }

  // if the table obj had an _id then it will have been retrieved
  let oldTable
  if (ctx.request.body && ctx.request.body._id) {
    oldTable = await db.get(ctx.request.body._id)
  }

  // make sure that types don't change of a column, have to remove
  // the column if you want to change the type
  if (oldTable && oldTable.schema) {
    for (let propKey of Object.keys(tableToSave.schema)) {
      let column = tableToSave.schema[propKey]
      let oldColumn = oldTable.schema[propKey]
      if (oldColumn && oldColumn.type !== column.type) {
        ctx.throw(400, "Cannot change the type of a column")
      }
    }
  }

  // Don't rename if the name is the same
  let { _rename } = tableToSave
  if (_rename && _rename.old === _rename.updated) {
    _rename = null
    delete tableToSave._rename
  }

  // rename row fields when table column is renamed
  if (_rename && tableToSave.schema[_rename.updated].type === "link") {
    ctx.throw(400, "Cannot rename a linked column.")
  } else if (_rename && tableToSave.primaryDisplay === _rename.old) {
    ctx.throw(400, "Cannot rename the display column.")
  }

  let updatedRows = await checkForColumnUpdates(db, oldTable, tableToSave)

  // update schema of non-statistics views when new columns are added
  for (let view in tableToSave.views) {
    const tableView = tableToSave.views[view]
    if (!tableView) continue

    if (tableView.schema.group || tableView.schema.field) continue
    tableView.schema = tableToSave.schema
  }

  // update linked rows
  const linkResp = await linkRows.updateLinks({
    appId,
    eventType: oldTable
      ? linkRows.EventType.TABLE_UPDATED
      : linkRows.EventType.TABLE_SAVE,
    table: tableToSave,
    oldTable: oldTable,
  })
  if (linkResp != null && linkResp._rev) {
    tableToSave._rev = linkResp._rev
  }

  // don't perform any updates until relationships have been
  // checked by the updateLinks function
  if (updatedRows && updatedRows.length !== 0) {
    await db.bulkDocs(updatedRows)
  }
  const result = await db.post(tableToSave)
  tableToSave._rev = result.rev

  ctx.eventEmitter &&
    ctx.eventEmitter.emitTable(`table:save`, appId, tableToSave)

  if (dataImport && dataImport.csvString) {
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
  const appId = ctx.user.appId
  const db = new CouchDB(appId)
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
    appId,
    eventType: linkRows.EventType.TABLE_DELETE,
    table: tableToDelete,
  })

  // don't remove the table itself until very end
  await db.remove(tableToDelete)

  ctx.eventEmitter &&
    ctx.eventEmitter.emitTable(`table:delete`, appId, tableToDelete)
  ctx.status = 200
  ctx.message = `Table ${ctx.params.tableId} deleted.`
}

exports.validateCSVSchema = async function(ctx) {
  const { csvString, schema = {} } = ctx.request.body
  const result = await csvParser.parse(csvString, schema)
  ctx.body = { schema: result }
}
