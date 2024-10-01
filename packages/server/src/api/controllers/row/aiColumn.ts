import { getRowParams } from "../../../db/utils"
import {
  outputProcessing,
  processAIColumns,
} from "../../../utilities/rowProcessor"
import { context } from "@budibase/backend-core"
import { Table, Row } from "@budibase/types"
import isEqual from "lodash/isEqual"
import { cloneDeep } from "lodash/fp"

export async function updateAllAIColumnsInTable(table: Table) {
  const db = context.getAppDB()
  // start by getting the raw rows (which will be written back to DB after update)
  let rows = (
    await db.allDocs<Row>(
      getRowParams(table._id, null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc!)
  // now enrich the rows, note the clone so that we have the base state of the
  // rows so that we don't write any of the enriched information back
  let enrichedRows = await outputProcessing(table, cloneDeep(rows), {
    squash: false,
  })
  const updatedRows = []
  for (let row of rows) {
    // find the enriched row, if found process the formulas
    const enrichedRow = enrichedRows.find(
      (enriched: Row) => enriched._id === row._id
    )
    if (enrichedRow) {
      let processed = await processAIColumns(table, cloneDeep(row), {
        contextRows: [enrichedRow],
      })
      // values have changed, need to add to bulk docs to update
      if (!isEqual(processed, row)) {
        updatedRows.push(processed)
      }
    }
  }
  await db.bulkDocs(updatedRows)
}
