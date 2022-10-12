const { FieldTypes, FormulaTypes } = require("../../../constants")
const { clearColumns } = require("./utils")
const { doesContainStrings } = require("@budibase/string-templates")
const { cloneDeep } = require("lodash/fp")
const { isEqual, uniq } = require("lodash")
const { updateAllFormulasInTable } = require("../row/staticFormula")
const { getAppDB } = require("@budibase/backend-core/context")
const sdk = require("../../../sdk")

function isStaticFormula(column) {
  return (
    column.type === FieldTypes.FORMULA &&
    column.formulaType === FormulaTypes.STATIC
  )
}

/**
 * This retrieves the formula columns from a table schema that use a specified column name
 * in the formula.
 */
function getFormulaThatUseColumn(table, columnNames) {
  let formula = []
  columnNames = Array.isArray(columnNames) ? columnNames : [columnNames]
  for (let column of Object.values(table.schema)) {
    // not a static formula, or doesn't contain a relationship
    if (!isStaticFormula(column)) {
      continue
    }
    if (!doesContainStrings(column?.formula ?? "", columnNames)) {
      continue
    }
    formula.push(column.name)
  }
  return formula
}

/**
 * This functions checks for when a related table, column or related column is deleted, if any
 * tables need to have the formula column removed.
 */
async function checkIfFormulaNeedsCleared(table, { oldTable, deletion }) {
  // start by retrieving all tables, remove the current table from the list
  const tables = (await sdk.tables.getAllInternalTables()).filter(
    tbl => tbl._id !== table._id
  )
  const schemaToUse = oldTable ? oldTable.schema : table.schema
  let removedColumns = Object.values(schemaToUse).filter(
    column => deletion || !table.schema[column.name]
  )
  // remove any formula columns that used related columns
  for (let removed of removedColumns) {
    let tableToUse = table
    // if relationship, get the related table
    if (removed.type === FieldTypes.LINK) {
      tableToUse = tables.find(table => table._id === removed.tableId)
    }
    const columnsToDelete = getFormulaThatUseColumn(tableToUse, removed.name)
    if (columnsToDelete.length > 0) {
      await clearColumns(table, columnsToDelete)
    }
    // need a special case, where a column has been removed from this table, but was used
    // in a different, related tables formula
    if (!table.relatedFormula) {
      continue
    }
    for (let relatedTableId of table.relatedFormula) {
      const relatedColumns = Object.values(table.schema).filter(
        column => column.tableId === relatedTableId
      )
      const relatedTable = tables.find(table => table._id === relatedTableId)
      // look to see if the column was used in a relationship formula,
      // relationships won't be used for this
      if (relatedTable && relatedColumns && removed.type !== FieldTypes.LINK) {
        let relatedFormulaToRemove = []
        for (let column of relatedColumns) {
          relatedFormulaToRemove = relatedFormulaToRemove.concat(
            getFormulaThatUseColumn(relatedTable, [
              column.fieldName,
              removed.name,
            ])
          )
        }
        if (relatedFormulaToRemove.length > 0) {
          await clearColumns(relatedTable, uniq(relatedFormulaToRemove))
        }
      }
    }
  }
}

/**
 * This function adds a note to related tables that they are
 * used in a static formula - so that the link controller
 * can manage hydrating related rows formula fields. This is
 * specifically only for static formula.
 */
async function updateRelatedFormulaLinksOnTables(
  table,
  { deletion } = { deletion: false }
) {
  const db = getAppDB()
  // start by retrieving all tables, remove the current table from the list
  const tables = (await sdk.tables.getAllInternalTables()).filter(
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
  // if deleting, just remove the table IDs, don't try add
  if (!deletion) {
    for (let relatedCol of relatedColumns) {
      let columns = getFormulaThatUseColumn(table, relatedCol.name)
      if (!columns || columns.length === 0) {
        continue
      }
      const relatedTable = tables.find(
        related => related._id === relatedCol.tableId
      )
      // check if the table is already in the list of related formula, if it isn't, then add it
      if (
        relatedTable &&
        (!relatedTable.relatedFormula ||
          !relatedTable.relatedFormula.includes(table._id))
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

async function checkIfFormulaUpdated(table, { oldTable }) {
  // look to see if any formula values have changed
  const shouldUpdate = Object.values(table.schema).find(
    column =>
      isStaticFormula(column) &&
      (!oldTable ||
        !oldTable.schema[column.name] ||
        !isEqual(oldTable.schema[column.name], column))
  )
  // if a static formula column has updated, then need to run the update
  if (shouldUpdate != null) {
    await updateAllFormulasInTable(table)
  }
}

exports.runStaticFormulaChecks = async (table, { oldTable, deletion }) => {
  await updateRelatedFormulaLinksOnTables(table, { deletion })
  await checkIfFormulaNeedsCleared(table, { oldTable, deletion })
  if (!deletion) {
    await checkIfFormulaUpdated(table, { oldTable })
  }
}
