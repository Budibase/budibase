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
  description: "Get a single row from the database",
  icon: "box-arrow-down",
  name: "Get Row",
  tagline: "Get a row from {{inputs.enriched.table.name}} table",
  type: AutomationStepType.ACTION,
  stepId: AutomationActionStepId.GET_ROW,
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
      },
      required: ["tableId"],
    },
    outputs: {
      properties: {
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          description: "The row that was found",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the query was successful",
        },
      },
      required: ["row", "success"],
    },
  },
}
