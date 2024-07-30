import * as rowController from "../../api/controllers/row"
import * as tableController from "../../api/controllers/table"
import { buildCtx } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  FieldType,
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepSchema,
  AutomationStepType,
  EmptyFilterOption,
  SearchFilters,
  Table,
  SortOrder,
  QueryRowsStepInputs,
  QueryRowsStepOutputs,
} from "@budibase/types"
import { db as dbCore } from "@budibase/backend-core"

const SortOrderPretty = {
  [SortOrder.ASCENDING]: "Ascending",
  [SortOrder.DESCENDING]: "Descending",
}

export const definition: AutomationStepSchema = {
  description: "Query rows from the database",
  icon: "Search",
  name: "Query rows",
  tagline: "Query rows from {{inputs.enriched.table.name}} table",
  type: AutomationStepType.ACTION,
  stepId: AutomationActionStepId.QUERY_ROWS,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  inputs: {},
  schema: {
    inputs: {
      properties: {
        tableId: {
          type: AutomationIOType.STRING,
          customType: AutomationCustomIOType.TABLE,
          title: "Table",
        },
        filters: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.FILTERS,
          title: "Filtering",
        },
        sortColumn: {
          type: AutomationIOType.STRING,
          title: "Sort Column",
          customType: AutomationCustomIOType.COLUMN,
        },
        sortOrder: {
          type: AutomationIOType.STRING,
          title: "Sort Order",
          enum: Object.values(SortOrder),
          pretty: Object.values(SortOrderPretty),
        },
        limit: {
          type: AutomationIOType.NUMBER,
          title: "Limit",
          customType: AutomationCustomIOType.QUERY_LIMIT,
        },
      },
      required: ["tableId"],
    },
    outputs: {
      properties: {
        rows: {
          type: AutomationIOType.ARRAY,
          customType: AutomationCustomIOType.ROWS,
          description: "The rows that were found",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
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
    const searchParam = filters[key as keyof SearchFilters]
    if (typeof searchParam === "object") {
      for (let [property, value] of Object.entries(searchParam)) {
        // We need to strip numerical prefixes here, so that we can look up
        // the correct field name in the schema
        const columnName = dbCore.removeKeyNumbering(property)
        const column = table.schema[columnName]

        // convert string inputs
        if (!column || typeof value !== "string") {
          continue
        }
        if (column.type === FieldType.NUMBER) {
          if (key === "oneOf") {
            searchParam[property] = value
              .split(",")
              .map(item => parseFloat(item))
          } else {
            searchParam[property] = parseFloat(value)
          }
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

export async function run({
  inputs,
  appId,
}: {
  inputs: QueryRowsStepInputs
  appId: string
}): Promise<QueryRowsStepOutputs> {
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
  let sortType = FieldType.STRING
  if (sortColumn && table && table.schema && table.schema[sortColumn]) {
    const fieldType = table.schema[sortColumn].type
    sortType =
      fieldType === FieldType.NUMBER ? FieldType.NUMBER : FieldType.STRING
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
