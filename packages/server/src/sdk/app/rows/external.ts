import { IncludeRelationship, Operation, Row } from "@budibase/types"
import { HTTPError } from "@budibase/backend-core"
import { handleRequest } from "../../../api/controllers/row/external"
import { breakRowIdField } from "../../../integrations/utils"
import sdk from "../../../sdk"
import {
  inputProcessing,
  outputProcessing,
} from "../../../utilities/rowProcessor"
import cloneDeep from "lodash/fp/cloneDeep"
import isEqual from "lodash/fp/isEqual"

export async function getRow(
  tableId: string,
  rowId: string,
  opts?: { relationships?: boolean }
) {
  const response = await handleRequest(Operation.READ, tableId, {
    id: breakRowIdField(rowId),
    includeSqlRelationships: opts?.relationships
      ? IncludeRelationship.INCLUDE
      : IncludeRelationship.EXCLUDE,
  })
  return response ? response[0] : response
}

export async function save(
  tableId: string,
  inputs: Row,
  userId: string | undefined
) {
  const table = await sdk.tables.getTable(tableId)
  const { table: updatedTable, row } = await inputProcessing(
    userId,
    cloneDeep(table),
    inputs
  )

  const validateResult = await sdk.rows.utils.validate({
    row,
    tableId,
  })
  if (!validateResult.valid) {
    throw { validation: validateResult.errors }
  }

  const response = await handleRequest(Operation.CREATE, tableId, {
    row,
  })

  if (!isEqual(table, updatedTable)) {
    await sdk.tables.saveTable(updatedTable)
  }

  const rowId = response.row._id
  if (rowId) {
    const row = await getRow(tableId, rowId, {
      relationships: true,
    })
    return {
      ...response,
      row: await outputProcessing(table, row, {
        preserveLinks: true,
        squash: true,
      }),
    }
  } else {
    return response
  }
}

export async function find(tableId: string, rowId: string): Promise<Row> {
  const row = await getRow(tableId, rowId, {
    relationships: true,
  })

  if (!row) {
    throw new HTTPError("Row not found", 404)
  }

  const table = await sdk.tables.getTable(tableId)
  // Preserving links, as the outputProcessing does not support external rows yet and we don't need it in this use case
  return await outputProcessing(table, row, {
    squash: true,
    preserveLinks: true,
  })
}
