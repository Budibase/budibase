import { db } from "@budibase/backend-core"
import { Row } from "@budibase/types"
import sdk from "../../../sdk"
import cloneDeep from "lodash/fp/cloneDeep"
import { finaliseRow } from "src/api/controllers/row/staticFormula"
import { inputProcessing } from "src/utilities/rowProcessor"
import * as linkRows from "../../../db/linkedRows"

export async function save(
  tableId: string,
  inputs: Row,
  userId: string | undefined
) {
  inputs.tableId = tableId

  if (!inputs._rev && !inputs._id) {
    inputs._id = db.generateRowID(inputs.tableId)
  }

  // this returns the table and row incase they have been updated
  const dbTable = await sdk.tables.getTable(inputs.tableId)

  // need to copy the table so it can be differenced on way out
  const tableClone = cloneDeep(dbTable)

  let { table, row } = await inputProcessing(userId, tableClone, inputs)

  const validateResult = await sdk.rows.utils.validate({
    row,
    table,
  })

  if (!validateResult.valid) {
    throw { validation: validateResult.errors }
  }

  // make sure link rows are up-to-date
  row = (await linkRows.updateLinks({
    eventType: linkRows.EventType.ROW_SAVE,
    row,
    tableId: row.tableId,
    table,
  })) as Row

  return finaliseRow(table, row, {
    oldTable: dbTable,
    updateFormula: true,
  })
}
