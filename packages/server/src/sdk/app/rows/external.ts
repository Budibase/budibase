import { IncludeRelationship, Operation, Row } from "@budibase/types"
import sdk from "../../../sdk"
import { handleRequest } from "../../../api/controllers/row/external"
import { breakRowIdField } from "../../../integrations/utils"

export async function patch(tableId: string, data: Row): Promise<Row> {
  let { _viewId, _id: id, ...rowData } = data

  const table = await sdk.tables.getTable(tableId)
  if (_viewId) {
    rowData = await sdk.rows.utils.trimViewFields(_viewId, table, rowData)
  }

  const validateResult = await sdk.rows.utils.validate({
    row: rowData,
    tableId,
  })
  if (!validateResult.valid) {
    throw { validation: validateResult.errors }
  }
  const response = await handleRequest(Operation.UPDATE, tableId, {
    id: breakRowIdField(id!),
    row: rowData,
  })
  const row = await getRow(tableId, id!, { relationships: true })
  return {
    ...response,
    row,
    table,
  }
}

export async function getRow(
  tableId: string,
  rowId: string,
  opts?: { relationships?: boolean }
) {
  const response = (await handleRequest(Operation.READ, tableId, {
    id: breakRowIdField(rowId),
    includeSqlRelationships: opts?.relationships
      ? IncludeRelationship.INCLUDE
      : IncludeRelationship.EXCLUDE,
  })) as Row[]
  return response ? response[0] : response
}
