import {
  IncludeRelationship,
  Operation,
  Row,
  Table,
  ViewV2,
} from "@budibase/types"
import { docIds, HTTPError } from "@budibase/backend-core"
import { handleRequest } from "../../../api/controllers/row/external"
import { breakRowIdField } from "../../../integrations/utils"
import sdk from "../../../sdk"
import {
  inputProcessing,
  outputProcessing,
} from "../../../utilities/rowProcessor"
import cloneDeep from "lodash/fp/cloneDeep"
import { tryExtractingTableAndViewId } from "./utils"
import { helpers } from "@budibase/shared-core"

export async function getRow(
  sourceId: string | Table | ViewV2,
  rowId: string,
  opts?: { relationships?: boolean }
) {
  let source: Table | ViewV2
  if (typeof sourceId === "string") {
    if (docIds.isViewId(sourceId)) {
      source = await sdk.views.get(sourceId)
    } else {
      source = await sdk.tables.getTable(sourceId)
    }
  } else {
    source = sourceId
  }
  const response = await handleRequest(Operation.READ, source, {
    id: breakRowIdField(rowId),
    includeSqlRelationships: opts?.relationships
      ? IncludeRelationship.INCLUDE
      : IncludeRelationship.EXCLUDE,
  })
  const rows = response?.rows || []
  return rows[0]
}

export async function save(
  sourceId: string,
  inputs: Row,
  userId: string | undefined
) {
  const { tableId, viewId } = tryExtractingTableAndViewId(sourceId)
  let source: Table | ViewV2
  if (viewId) {
    source = await sdk.views.get(viewId)
  } else {
    source = await sdk.tables.getTable(tableId)
  }

  if (sdk.views.isView(source) && helpers.views.isCalculationView(source)) {
    throw new HTTPError("Cannot insert rows through a calculation view", 400)
  }

  const row = await inputProcessing(userId, cloneDeep(source), inputs)

  const validateResult = await sdk.rows.utils.validate({
    row,
    source,
  })
  if (!validateResult.valid) {
    throw { validation: validateResult.errors }
  }

  const response = await handleRequest(Operation.CREATE, source, {
    row,
  })

  const rowId = response.row._id
  if (rowId) {
    const row = await getRow(source, rowId, {
      relationships: true,
    })
    return {
      ...response,
      row: await outputProcessing(source, row, {
        preserveLinks: true,
        squash: true,
      }),
    }
  } else {
    return response
  }
}

export async function find(tableOrViewId: string, rowId: string): Promise<Row> {
  const { tableId, viewId } = tryExtractingTableAndViewId(tableOrViewId)

  let source: Table | ViewV2
  if (viewId) {
    source = await sdk.views.get(viewId)
  } else {
    source = await sdk.tables.getTable(tableId)
  }

  const row = await getRow(source, rowId, {
    relationships: true,
  })

  if (!row) {
    throw new HTTPError("Row not found", 404)
  }

  // Preserving links, as the outputProcessing does not support external rows
  // yet and we don't need it in this use case
  return await outputProcessing(source, row, {
    squash: true,
    preserveLinks: true,
  })
}
