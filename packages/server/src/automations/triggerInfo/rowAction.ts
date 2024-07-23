import {
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepType,
  AutomationTriggerSchema,
  AutomationTriggerStepId,
  AutomationEventType,
} from "@budibase/types"

export const definition: AutomationTriggerSchema = {
  type: AutomationStepType.TRIGGER,
  tagline:
    "Row action triggered in {{inputs.enriched.table.name}} by {{inputs.enriched.row._id}}",
  name: "Row Action",
  description: "TODO description",
  icon: "Workflow",
  stepId: AutomationTriggerStepId.ROW_ACTION,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        tableId: {
          type: AutomationIOType.STRING,
          customType: AutomationCustomIOType.TABLE,
          title: "Table",
          readonly: true,
        },
      },
      required: ["tableId"],
    },
    outputs: {
      properties: {
        id: {
          type: AutomationIOType.STRING,
          description: "Row ID - can be used for updating",
        },
        revision: {
          type: AutomationIOType.STRING,
          description: "Revision of row",
        },
        table: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.TABLE,
          title: "Table",
        },
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          description: "The new row that was created",
        },
      },
    },
  },
  event: AutomationEventType.ROW_SAVE,
}
