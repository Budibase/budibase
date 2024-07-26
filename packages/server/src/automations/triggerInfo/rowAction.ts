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
    outputs: { properties: {} },
  },

  event: AutomationEventType.ROW_SAVE,
}
