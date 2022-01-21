const CouchDB = require("../../../db")
const linkRows = require("../../../db/linkedRows")
const { getRowParams, generateTableID } = require("../../../db/utils")
const { FieldTypes, FormulaTypes } = require("../../../constants")
const {
  TableSaveFunctions,
  hasTypeChanged,
  getTable,
  handleDataImport,
  getAllInternalTables,
} = require("./utils")
const usageQuota = require("../../../utilities/usageQuota")
const { doesContainString } = require("@budibase/string-templates")
const { cloneDeep } = require("lodash/fp")
const { isEqual } = require("lodash")

/**
 * This function adds a note to related tables that they are
 * used in a static formula - so that the link controller
 * can manage hydrating related rows formula fields. This is
 * specifically only for static formula.
 */
async function updateRelatedTablesForFormula(db, table) {
  // start by retrieving all tables, remove the current table from the list
  const tables = (await getAllInternalTables({ db })).filter(
    tbl => tbl._id !== table._id
  )
  // clone the tables, so we can compare at end
  const initialTables = cloneDeep(tables)
  // first find the related column names
  const relatedColumns = Object.values(table.schema).filter(
    col => col.type === FieldTypes.LINK
  )
  // we start by removing the formula field from all tables
  for (let otherTable of tables) {
    if (!otherTable.relatedFormula) {
      continue
    }
    const index = otherTable.relatedFormula.indexOf(table._id)
    if (index !== -1) {
      otherTable.relatedFormula.splice(index, 1)
    }
  }
  for (let column of Object.values(table.schema)) {
    // not a static formula, or doesn't contain a relationship
    if (
      column.type !== FieldTypes.FORMULA ||
      column.formulaType !== FormulaTypes.STATIC
    ) {
      continue
    }
    // check to see if any relationship columns are used in formula
    for (let relatedCol of relatedColumns) {
      if (!doesContainString(column.formula, relatedCol.name)) {
        continue
      }
      const relatedTable = tables.find(
        related => related._id === relatedCol.tableId
      )
      // check if the table is already in the list of related formula, if it isn't, then add it
      if (
        relatedTable &&
        (!relatedTable.relatedFormula ||
          relatedTable.relatedFormula.indexOf(table._id) === -1)
      ) {
        relatedTable.relatedFormula = relatedTable.relatedFormula
          ? [...relatedTable.relatedFormula, table._id]
          : [table._id]
      }
    }
  }
  // now we just need to compare all the tables and see if any need saved
  for (let initial of initialTables) {
    const found = tables.find(tbl => initial._id === tbl._id)
    if (found && !isEqual(initial, found)) {
      await db.put(found)
    }
  }
}

exports.save = async function (ctx) {
  const appId = ctx.appId
  const db = new CouchDB(appId)
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
    db,
    ctx,
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
  await updateRelatedTablesForFormula(db, tableToSave)

  return tableToSave
}

exports.destroy = async function (ctx) {
  const appId = ctx.appId
  const db = new CouchDB(appId)
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
    appId,
    eventType: linkRows.EventType.TABLE_DELETE,
    table: tableToDelete,
  })

  // don't remove the table itself until very end
  await db.remove(tableToDelete)

  // remove table search index
  const currentIndexes = await db.getIndexes()
  const existingIndex = currentIndexes.indexes.find(
    existing => existing.name === `search:${ctx.params.tableId}`
  )
  if (existingIndex) {
    await db.deleteIndex(existingIndex)
  }

  return tableToDelete
}

exports.bulkImport = async function (ctx) {
  const appId = ctx.appId
  const table = await getTable(appId, ctx.params.tableId)
  const { dataImport } = ctx.request.body
  await handleDataImport(appId, ctx.user, table, dataImport)
  return table
}
