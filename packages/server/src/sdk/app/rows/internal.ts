import { context, db, HTTPError } from "@budibase/backend-core"
import { Row, Table, ViewV2 } from "@budibase/types"
import sdk from "../../../sdk"
import { finaliseRow } from "../../../api/controllers/row/staticFormula"
import {
  inputProcessing,
  outputProcessing,
} from "../../../utilities/rowProcessor"
import * as linkRows from "../../../db/linkedRows"
import { InternalTables } from "../../../db/utils"
import { getFullUser } from "../../../utilities/users"
import { getSource, tryExtractingTableAndViewId } from "./utils"
import { helpers } from "@budibase/shared-core"

export async function save(
  tableOrViewId: string,
  inputs: Row,
  userId: string | undefined
) {
  const { tableId, viewId } = tryExtractingTableAndViewId(tableOrViewId)
  inputs.tableId = tableId

  let source: Table | ViewV2
  let table: Table
  if (viewId) {
    source = await sdk.views.get(viewId)
    table = await sdk.views.getTable(viewId)
  } else {
    source = await sdk.tables.getTable(tableId)
    table = source
  }

  if (sdk.views.isView(source) && helpers.views.isCalculationView(source)) {
    throw new HTTPError("Cannot insert rows through a calculation view", 400)
  }

  if (!inputs._rev && !inputs._id) {
    inputs._id = db.generateRowID(inputs.tableId)
  }

  let row = await inputProcessing(userId, source, inputs)

  const validateResult = await sdk.rows.utils.validate({
    row,
    source,
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

  return finaliseRow(source, row, { updateFormula: true })
}

export async function find(sourceId: string, rowId: string): Promise<Row> {
  const source = await getSource(sourceId)
  return await outputProcessing(source, await findRow(sourceId, rowId), {
    squash: true,
  })
}

export async function findRow(sourceId: string, rowId: string) {
  const { tableId } = tryExtractingTableAndViewId(sourceId)
  const db = context.getAppDB()
  let row: Row
  // TODO remove special user case in future
  if (tableId === InternalTables.USER_METADATA) {
    row = await getFullUser(rowId)
  } else {
    row = await db.get(rowId)
  }
  if (row.tableId !== tableId) {
    throw "Supplied tableId does not match the rows tableId"
  }
  return row
}
