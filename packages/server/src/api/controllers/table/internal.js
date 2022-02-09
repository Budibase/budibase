const linkRows = require("../../../db/linkedRows")
const { getRowParams, generateTableID } = require("../../../db/utils")
const { FieldTypes } = require("../../../constants")
const {
  TableSaveFunctions,
  hasTypeChanged,
  getTable,
  handleDataImport,
} = require("./utils")
const usageQuota = require("../../../utilities/usageQuota")
const { getAppDB } = require("@budibase/backend-core/context")
const env = require("../../../environment")
const { cleanupAttachments } = require("../../../utilities/rowProcessor")
const { runStaticFormulaChecks } = require("./bulkFormula")

exports.save = async function (ctx) {
  const db = getAppDB()
  const { dataImport, ...rest } = ctx.request.body
  let tableToSave = {
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

  if (hasTypeChanged(tableToSave, oldTable)) {
    ctx.throw(400, "A column type has changed.")
  }

  // saving a table is a complex operation, involving many different steps, this
  // has been broken out into a utility to make it more obvious/easier to manipulate
  const tableSaveFunctions = new TableSaveFunctions({
    user: ctx.user,
    oldTable,
    dataImport,
  })
  tableToSave = await tableSaveFunctions.before(tableToSave)

  // make sure that types don't change of a column, have to remove
  // the column if you want to change the type
  if (oldTable && oldTable.schema) {
    for (let propKey of Object.keys(tableToSave.schema)) {
      let oldColumn = oldTable.schema[propKey]
      if (oldColumn && oldColumn.type === "internal") {
        oldColumn.type = "auto"
      }
    }
  }

  // Don't rename if the name is the same
  let { _rename } = tableToSave
  /* istanbul ignore next */
  if (_rename && _rename.old === _rename.updated) {
    _rename = null
    delete tableToSave._rename
  }

  // rename row fields when table column is renamed
  /* istanbul ignore next */
  if (_rename && tableToSave.schema[_rename.updated].type === FieldTypes.LINK) {
    ctx.throw(400, "Cannot rename a linked column.")
  }

  tableToSave = await tableSaveFunctions.mid(tableToSave)

  // update schema of non-statistics views when new columns are added
  for (let view in tableToSave.views) {
    const tableView = tableToSave.views[view]
    if (!tableView) continue

    if (tableView.schema.group || tableView.schema.field) continue
    tableView.schema = tableToSave.schema
  }

  // update linked rows
  try {
    const linkResp = await linkRows.updateLinks({
      eventType: oldTable
        ? linkRows.EventType.TABLE_UPDATED
        : linkRows.EventType.TABLE_SAVE,
      table: tableToSave,
      oldTable: oldTable,
    })
    if (linkResp != null && linkResp._rev) {
      tableToSave._rev = linkResp._rev
    }
  } catch (err) {
    ctx.throw(400, err)
  }

  // don't perform any updates until relationships have been
  // checked by the updateLinks function
  const updatedRows = tableSaveFunctions.getUpdatedRows()
  if (updatedRows && updatedRows.length !== 0) {
    await db.bulkDocs(updatedRows)
  }
  const result = await db.put(tableToSave)
  tableToSave._rev = result.rev

  tableToSave = await tableSaveFunctions.after(tableToSave)
  // has to run after, make sure it has _id
  await runStaticFormulaChecks(tableToSave, { oldTable })
  return tableToSave
}

exports.destroy = async function (ctx) {
  const db = getAppDB()
  const tableToDelete = await db.get(ctx.params.tableId)

  // Delete all rows for that table
  const rows = await db.allDocs(
    getRowParams(ctx.params.tableId, null, {
      include_docs: true,
    })
  )
  await db.bulkDocs(rows.rows.map(row => ({ ...row.doc, _deleted: true })))
  await usageQuota.update(usageQuota.Properties.ROW, -rows.rows.length)

  // update linked rows
  await linkRows.updateLinks({
    eventType: linkRows.EventType.TABLE_DELETE,
    table: tableToDelete,
  })

  // don't remove the table itself until very end
  await db.remove(tableToDelete)

  // remove table search index
  if (!env.isTest()) {
    const currentIndexes = await db.getIndexes()
    const existingIndex = currentIndexes.indexes.find(
      existing => existing.name === `search:${ctx.params.tableId}`
    )
    if (existingIndex) {
      await db.deleteIndex(existingIndex)
    }
  }

  // has to run after, make sure it has _id
  await runStaticFormulaChecks(tableToDelete, { deletion: true })
  await cleanupAttachments(tableToDelete, { rows })
  return tableToDelete
}

exports.bulkImport = async function (ctx) {
  const table = await getTable(ctx.params.tableId)
  const { dataImport } = ctx.request.body
  await handleDataImport(ctx.user, table, dataImport)
  return table
}
