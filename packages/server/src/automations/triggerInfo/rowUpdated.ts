import {
  AutomationTriggerSchema,
  AutomationTriggerStepId,
} from "@budibase/types"

export const definition: AutomationTriggerSchema = {
  name: "Row Updated",
  event: "row:update",
  icon: "Refresh",
  tagline: "Row is updated in {{inputs.enriched.table.name}}",
  description: "Fired when a row is updated in your database",
  stepId: AutomationTriggerStepId.ROW_UPDATED,
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
          description: "The row that was updated",
        },
        id: {
          type: "string",
          description: "Row ID - can be used for updating",
        },
        revision: {
          type: "string",
          description: "Revision of row",
        },
      },
      required: ["row", "id"],
    },
  },
  type: "TRIGGER",
}
