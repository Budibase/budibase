import {
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepType,
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
          type: AutomationIOType.STRING,
          customType: AutomationCustomIOType.TABLE,
          title: "Table",
        },
      },
      required: ["tableId"],
    },
    outputs: {
      properties: {
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          description: "The row that was updated",
        },
        id: {
          type: AutomationIOType.STRING,
          description: "Row ID - can be used for updating",
        },
        revision: {
          type: AutomationIOType.STRING,
          description: "Revision of row",
        },
      },
      required: ["row", "id"],
    },
  },
  type: AutomationStepType.TRIGGER,
}
