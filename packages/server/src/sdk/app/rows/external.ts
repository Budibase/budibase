import { IncludeRelationship, Operation, Row } from "@budibase/types"
import { handleRequest } from "../../../api/controllers/row/external"
import { breakRowIdField } from "../../../integrations/utils"
import { outputProcessing } from "../../../utilities/rowProcessor"
import sdk from "../../../sdk"

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
  const row = response ? response[0] : response

  const table = await sdk.tables.getTable(tableId)
  const enrichedRow = await outputProcessing(table, row)
  return enrichedRow
}
