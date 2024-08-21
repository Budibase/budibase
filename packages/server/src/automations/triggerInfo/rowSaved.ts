import {
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepType,
  AutomationTriggerStepId,
  AutomationEventType,
  AutomationTriggerDefinition,
} from "@budibase/types"

export const definition: AutomationTriggerDefinition = {
  name: "Row Created",
  event: AutomationEventType.ROW_SAVE,
  icon: "TableRowAddBottom",
  tagline: "Row is added to {{inputs.enriched.table.name}}",
  description: "Fired when a row is added to your database",
  stepId: AutomationTriggerStepId.ROW_SAVED,
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
          customType: AutomationCustomIOType.TRIGGER_FILTER,
          title: "Filtering",
        },
      },
      required: ["tableId"],
    },
    outputs: {
      properties: {
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          description: "The new row that was created",
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
