import { getRowParams } from "../../../db/utils"
import {
  outputProcessing,
  processAutoColumn,
  processFormulas,
} from "../../../utilities/rowProcessor"
import { FieldTypes, FormulaTypes } from "../../../constants"
import { context } from "@budibase/backend-core"
import { Table, Row } from "@budibase/types"
import * as linkRows from "../../../db/linkedRows"
import sdk from "../../../sdk"
import isEqual from "lodash/isEqual"
import { cloneDeep } from "lodash/fp"

/**
 * This function runs through a list of enriched rows, looks at the rows which
 * are related and then checks if they need the state of their formulas
 * updated.
 * NOTE: this will only for affect static formulas.
 */
export async function updateRelatedFormula(
  table: Table,
  enrichedRows: Row[] | Row
) {
  const db = context.getAppDB()
  // no formula to update, we're done
  if (!table.relatedFormula) {
    return
  }
  let promises: Promise<any>[] = []
  for (let enrichedRow of Array.isArray(enrichedRows)
    ? enrichedRows
    : [enrichedRows]) {
    // the related rows by tableId
    let relatedRows: Record<string, Row[]> = {}
    for (let [key, field] of Object.entries(enrichedRow)) {
      const columnDefinition = table.schema[key]
      if (columnDefinition && columnDefinition.type === FieldTypes.LINK) {
        const relatedTableId = columnDefinition.tableId!
        if (!relatedRows[relatedTableId]) {
          relatedRows[relatedTableId] = []
        }
        // filter down to the rows which are not already included in related
        const currentIds = relatedRows[relatedTableId].map(row => row._id)
        const uniqueRelatedRows = field.filter(
          (row: Row) => !currentIds.includes(row._id)
        )
        relatedRows[relatedTableId] =
          relatedRows[relatedTableId].concat(uniqueRelatedRows)
      }
    }
    for (let tableId of table.relatedFormula) {
      let relatedTable: Table
      try {
        // no rows to update, skip
        if (!relatedRows[tableId] || relatedRows[tableId].length === 0) {
          continue
        }
        relatedTable = await db.get(tableId)
      } catch (err) {
        // no error scenario, table doesn't seem to exist anymore, ignore
      }
      for (let column of Object.values(relatedTable!.schema)) {
        // needs updated in related rows
        if (
          column.type === FieldTypes.FORMULA &&
          column.formulaType === FormulaTypes.STATIC
        ) {
          // re-enrich rows for all the related, don't update the related formula for them
          promises = promises.concat(
            relatedRows[tableId].map(related =>
              finaliseRow(relatedTable, related, {
                updateFormula: false,
              })
            )
          )
          break
        }
      }
    }
  }
  await Promise.all(promises)
}

export async function updateAllFormulasInTable(table: Table) {
  const db = context.getAppDB()
  // start by getting the raw rows (which will be written back to DB after update)
  let rows = (
    await db.allDocs(
      getRowParams(table._id, null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
  // now enrich the rows, note the clone so that we have the base state of the
  // rows so that we don't write any of the enriched information back
  let enrichedRows = await outputProcessing(table, cloneDeep(rows), {
    squash: false,
  })
  const updatedRows = []
  for (let row of rows) {
    // find the enriched row, if found process the formulas
    const enrichedRow = enrichedRows.find(
      (enriched: any) => enriched._id === row._id
    )
    if (enrichedRow) {
      const processed = processFormulas(table, cloneDeep(row), {
        dynamic: false,
        contextRows: enrichedRow,
      })
      // values have changed, need to add to bulk docs to update
      if (!isEqual(processed, row)) {
        updatedRows.push(processed)
      }
    }
  }
  await db.bulkDocs(updatedRows)
}

/**
 * This function runs at the end of the save/patch functions of the row controller, all this
 * really does is enrich the row, handle any static formula processing, then return the enriched
 * row. The reason we need to return the enriched row is that the automation row created trigger
 * expects the row to be totally enriched/contain all relationships.
 */
export async function finaliseRow(
  table: Table,
  row: Row,
  { oldTable, updateFormula }: { oldTable?: Table; updateFormula: boolean } = {
    updateFormula: true,
  }
) {
  const db = context.getAppDB()
  row.type = "row"
  // process the row before return, to include relationships
  let enrichedRow = (await outputProcessing(table, cloneDeep(row), {
    squash: false,
  })) as Row
  // use enriched row to generate formulas for saving, specifically only use as context
  row = processFormulas(table, row, {
    dynamic: false,
    contextRows: enrichedRow,
  })
  // don't worry about rev, tables handle rev/lastID updates
  // if another row has been written since processing this will
  // handle the auto ID clash
  if (oldTable && !isEqual(oldTable, table)) {
    try {
      await db.put(table)
    } catch (err: any) {
      if (err.status === 409) {
        const updatedTable = await sdk.tables.getTable(table._id)
        let response = processAutoColumn(null, updatedTable, row, {
          reprocessing: true,
        })
        await db.put(response.table)
        row = response.row
      } else {
        throw err
      }
    }
  }
  const response = await db.put(row)
  // for response, calculate the formulas for the enriched row
  enrichedRow._rev = response.rev
  enrichedRow = await processFormulas(table, enrichedRow, { dynamic: false })
  // this updates the related formulas in other rows based on the relations to this row
  if (updateFormula) {
    await updateRelatedFormula(table, enrichedRow)
  }
  const squashed = await linkRows.squashLinksToPrimaryDisplay(
    table,
    enrichedRow
  )
  return { row: enrichedRow, squashed, table }
}
