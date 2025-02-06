import {
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepType,
  AutomationTriggerStepId,
  AutomationEventType,
  AutomationTriggerDefinition,
} from "@budibase/types"

export const definition: AutomationTriggerDefinition = {
  type: AutomationStepType.TRIGGER,
  name: "Row Action",
  event: AutomationEventType.ROW_ACTION, // TODO
  icon: "Workflow", // TODO
  tagline:
    "Row action triggered in {{inputs.enriched.table.name}} by {{inputs.enriched.row._id}}",
  description: "TODO description", // TODO
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
          title: "The table linked to the row action",
        },
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          description: "The row linked to the row action",
        },
      },
    },
  },
}
