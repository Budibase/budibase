import { IncludeRelationship, Operation, Row } from "@budibase/types"
import { handleRequest } from "../../../api/controllers/row/external"
import { breakRowIdField } from "../../../integrations/utils"

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
