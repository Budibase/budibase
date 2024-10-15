import { clearColumns } from "./utils"
import { doesContainStrings } from "@budibase/string-templates"
import { cloneDeep } from "lodash/fp"
import isEqual from "lodash/isEqual"
import uniq from "lodash/uniq"
import { updateAllFormulasInTable } from "../row/staticFormula"
import { context } from "@budibase/backend-core"
import {
  FieldSchema,
  FieldType,
  FormulaFieldMetadata,
  FormulaType,
  Table,
} from "@budibase/types"
import sdk from "../../../sdk"
import { isRelationshipColumn } from "../../../db/utils"

function isStaticFormula(
  column: FieldSchema
): column is FormulaFieldMetadata & { formulaType: FormulaType.STATIC } {
  return (
    column.type === FieldType.FORMULA &&
    column.formulaType === FormulaType.STATIC
  )
}

/**
 * This retrieves the formula columns from a table schema that use a specified column name
 * in the formula.
 */
function getFormulaThatUseColumn(table: Table, columnNames: string[] | string) {
  let formula: string[] = []
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
async function checkIfFormulaNeedsCleared(
  table: Table,
  { oldTable, deletion }: { oldTable?: Table; deletion?: boolean }
) {
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
    let tableToUse: Table | undefined = table
    // if relationship, get the related table
    if (removed.type === FieldType.LINK) {
      const removedTableId = removed.tableId
      tableToUse = tables.find(table => table._id === removedTableId)
    }
    if (!tableToUse) {
      continue
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
        column =>
          column.type === FieldType.LINK && column.tableId === relatedTableId
      )
      const relatedTable = tables.find(table => table._id === relatedTableId)
      // look to see if the column was used in a relationship formula,
      // relationships won't be used for this
      if (relatedTable && relatedColumns && removed.type !== FieldType.LINK) {
        let relatedFormulaToRemove: string[] = []
        for (let column of relatedColumns) {
          relatedFormulaToRemove = relatedFormulaToRemove.concat(
            getFormulaThatUseColumn(relatedTable, [
              (column as any).fieldName!,
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
  table: Table,
  { deletion }: { deletion?: boolean } = {}
) {
  const tableId: string = table._id!
  const db = context.getAppDB()
  // start by retrieving all tables, remove the current table from the list
  const tables = (await sdk.tables.getAllInternalTables()).filter(
    tbl => tbl._id !== tableId
  )
  // clone the tables, so we can compare at end
  const initialTables = cloneDeep(tables)
  // first find the related column names
  const relatedColumns = Object.values(table.schema).filter(
    isRelationshipColumn
  )
  // we start by removing the formula field from all tables
  for (let otherTable of tables) {
    if (!otherTable.relatedFormula) {
      continue
    }
    const index = otherTable.relatedFormula.indexOf(tableId)
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
          !relatedTable.relatedFormula.includes(tableId))
      ) {
        relatedTable.relatedFormula = relatedTable.relatedFormula
          ? [...relatedTable.relatedFormula, tableId]
          : [tableId]
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

async function checkIfFormulaUpdated(
  table: Table,
  { oldTable }: { oldTable?: Table }
) {
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

export async function runStaticFormulaChecks(
  table: Table,
  { oldTable, deletion }: { oldTable?: Table; deletion?: boolean }
) {
  await updateRelatedFormulaLinksOnTables(table, { deletion })
  await checkIfFormulaNeedsCleared(table, { oldTable, deletion })
  if (!deletion) {
    await checkIfFormulaUpdated(table, { oldTable })
  }
}
