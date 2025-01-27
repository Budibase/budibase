import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
  SortOrder,
} from "@budibase/types"

const SortOrderPretty = {
  [SortOrder.ASCENDING]: "Ascending",
  [SortOrder.DESCENDING]: "Descending",
}

export const definition: AutomationStepDefinition = {
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
