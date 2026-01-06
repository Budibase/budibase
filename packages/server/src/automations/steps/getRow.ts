import * as rowController from "../../api/controllers/row"
import * as tableController from "../../api/controllers/table"
import { buildCtx, hasNullFilters } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  FieldType,
  EmptyFilterOption,
  SortOrder,
  GetRowStepInputs,
  GetRowStepOutputs,
} from "@budibase/types"

async function getTable(appId: string, tableId: string) {
  const ctx: any = buildCtx(appId, null, {
    params: {
      tableId,
    },
  })
  await tableController.find(ctx)
  return ctx.body
}

export async function run({
  inputs,
  appId,
}: {
  inputs: GetRowStepInputs
  appId: string
}): Promise<GetRowStepOutputs> {
  const { tableId, rowId, filters, sortColumn, sortOrder } = inputs
  if (!tableId) {
    return {
      success: false,
      row: null,
      response: {
        message: "You must select a table to query.",
      },
    }
  }

  if (rowId) {
    const ctx = buildCtx(appId, null, {
      params: {
        tableId: decodeURIComponent(tableId),
        rowId,
      },
    })

    try {
      await rowController.find(ctx)
      return {
        row: ctx.body || null,
        success: true,
      }
    } catch (err) {
      // continue
    }
  }

  const hasFilters =
    (filters && Object.keys(filters).length > 0) ||
    (inputs["filters-def"] && inputs["filters-def"].length > 0)
  if (!hasFilters) {
    return {
      success: false,
      row: null,
      response: {
        message:
          "You must provide a matching row ID or at least one filter to get row.",
      },
    }
  }

  const table = await getTable(appId, tableId)
  let sortType = FieldType.STRING
  if (sortColumn && table && table.schema && table.schema[sortColumn]) {
    const fieldType = table.schema[sortColumn].type
    sortType =
      fieldType === FieldType.NUMBER ? FieldType.NUMBER : FieldType.STRING
  }

  const ctx = buildCtx(appId, null, {
    params: {
      tableId: decodeURIComponent(tableId),
    },
    body: {
      sortType,
      limit: 1,
      sort: sortColumn,
      query: filters || {},
      sortOrder: sortOrder || SortOrder.ASCENDING,
    },
    version: "1",
  })

  try {
    let rows

    if (
      inputs.onEmptyFilter === EmptyFilterOption.RETURN_NONE &&
      inputs["filters-def"] &&
      hasNullFilters(inputs["filters-def"])
    ) {
      rows = []
    } else {
      await rowController.search(ctx)
      rows = ctx.body ? ctx.body.rows : []
    }

    return {
      row: rows && rows.length > 0 ? rows[0] : null,
      success: true,
    }
  } catch (err) {
    return {
      success: false,
      row: null,
      response: automationUtils.getError(err),
    }
  }
}
