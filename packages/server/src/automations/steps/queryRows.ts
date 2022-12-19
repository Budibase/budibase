import * as rowController from "../../api/controllers/row"
import * as tableController from "../../api/controllers/table"
import { FieldTypes } from "../../constants"
import { buildCtx } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
  SearchFilters,
  Table,
} from "@budibase/types"

enum SortOrder {
  ASCENDING = "ascending",
  DESCENDING = "descending",
}

const SortOrderPretty = {
  [SortOrder.ASCENDING]: "Ascending",
  [SortOrder.DESCENDING]: "Descending",
}

enum EmptyFilterOption {
  RETURN_ALL = "all",
  RETURN_NONE = "none",
}

const EmptyFilterOptionPretty = {
  [EmptyFilterOption.RETURN_ALL]: "Return all table rows",
  [EmptyFilterOption.RETURN_NONE]: "Return no rows",
}

export const definition: AutomationStepSchema = {
  description: "Query rows from the database",
  icon: "Search",
  name: "Query rows",
  tagline: "Query rows from {{inputs.enriched.table.name}} table",
  type: "ACTION",
  stepId: AutomationActionStepId.QUERY_ROWS,
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        tableId: {
          type: "string",
          customType: "table",
          title: "Table",
        },
        filters: {
          type: "object",
          customType: "filters",
          title: "Filtering",
        },
        sortColumn: {
          type: "string",
          title: "Sort Column",
          customType: "column",
        },
        sortOrder: {
          type: "string",
          title: "Sort Order",
          enum: Object.values(SortOrder),
          pretty: Object.values(SortOrderPretty),
        },
        limit: {
          type: "number",
          title: "Limit",
          customType: "queryLimit",
        },
        onEmptyFilter: {
          pretty: Object.values(EmptyFilterOptionPretty),
          enum: Object.values(EmptyFilterOption),
          type: "string",
          title: "When Filter Empty",
        },
      },
      required: ["tableId"],
    },
    outputs: {
      properties: {
        rows: {
          type: "array",
          customType: "rows",
          description: "The rows that were found",
        },
        success: {
          type: "boolean",
          description: "Whether the query was successful",
        },
      },
      required: ["rows", "success"],
    },
  },
}

async function getTable(appId: string, tableId: string) {
  const ctx: any = buildCtx(appId, null, {
    params: {
      tableId,
    },
  })
  await tableController.find(ctx)
  return ctx.body
}

function typeCoercion(filters: SearchFilters, table: Table) {
  if (!filters || !table) {
    return filters
  }
  for (let key of Object.keys(filters)) {
    // @ts-ignore
    const searchParam = filters[key]
    if (typeof searchParam === "object") {
      for (let [property, value] of Object.entries(searchParam)) {
        const column = table.schema[property]
        // convert string inputs
        if (!column || typeof value !== "string") {
          continue
        }
        if (column.type === FieldTypes.NUMBER) {
          searchParam[property] = parseFloat(value)
        }
      }
    }
  }
  return filters
}

function hasNullFilters(filters: any[]) {
  return (
    filters.length === 0 ||
    filters.some(filter => filter.value === null || filter.value === "")
  )
}

export async function run({ inputs, appId }: AutomationStepInput) {
  const { tableId, filters, sortColumn, sortOrder, limit } = inputs
  if (!tableId) {
    return {
      success: false,
      response: {
        message: "You must select a table to query.",
      },
    }
  }
  const table = await getTable(appId, tableId)
  let sortType = FieldTypes.STRING
  if (table && table.schema && table.schema[sortColumn] && sortColumn) {
    const fieldType = table.schema[sortColumn].type
    sortType =
      fieldType === FieldTypes.NUMBER ? FieldTypes.NUMBER : FieldTypes.STRING
  }
  const ctx: any = buildCtx(appId, null, {
    params: {
      tableId,
    },
    body: {
      sortType,
      limit,
      sort: sortColumn,
      query: typeCoercion(filters || {}, table),
      // default to ascending, like data tab
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
      rows,
      success: ctx.status === 200,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
