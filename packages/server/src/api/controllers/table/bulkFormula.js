const { FieldTypes, FormulaTypes } = require("../../../constants")
const { getAllInternalTables } = require("./utils")
const { doesContainString } = require("@budibase/string-templates")
const { cloneDeep } = require("lodash/fp")
const { isEqual } = require("lodash")

/**
 * This retrieves the formula columns from a table schema that use a specified column name
 * in the formula.
 */
function getFormulaThatUseColumn(table, columnName) {
  let formula = []
  for (let column of Object.values(table.schema)) {
    // not a static formula, or doesn't contain a relationship
    if (
      column.type !== FieldTypes.FORMULA ||
      column.formulaType !== FormulaTypes.STATIC
    ) {
      continue
    }
    if (!doesContainString(column.formula, columnName)) {
      continue
    }
    formula.push(column.name)
  }
  return formula
}

/**
 * This function adds a note to related tables that they are
 * used in a static formula - so that the link controller
 * can manage hydrating related rows formula fields. This is
 * specifically only for static formula.
 */
exports.updateRelatedFormulaLinksOnTables = async (
  db,
  table,
  { deletion } = { deletion: false }
) => {
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
          relatedTable.relatedFormula.includes(table._id))
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
