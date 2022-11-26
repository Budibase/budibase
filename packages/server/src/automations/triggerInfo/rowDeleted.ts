import {
  AutomationTriggerSchema,
  AutomationTriggerStepId,
} from "@budibase/types"

export const definition: AutomationTriggerSchema = {
  name: "Row Deleted",
  event: "row:delete",
  icon: "TableRowRemoveCenter",
  tagline: "Row is deleted from {{inputs.enriched.table.name}}",
  description: "Fired when a row is deleted from your database",
  stepId: AutomationTriggerStepId.ROW_DELETED,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        tableId: {
          type: "string",
          customType: "table",
          title: "Table",
        },
      },
      required: ["tableId"],
    },
    outputs: {
      properties: {
        row: {
          type: "object",
          customType: "row",
          description: "The row that was deleted",
        },
      },
      required: ["row"],
    },
  },
  type: "TRIGGER",
}
