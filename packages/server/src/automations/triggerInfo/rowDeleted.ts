import {
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepType,
  AutomationTriggerSchema,
  AutomationTriggerStepId,
  AutomationEventType,
  Row,
} from "@budibase/types"

export const definition: AutomationTriggerSchema = {
  name: "Row Deleted",
  event: AutomationEventType.ROW_DELETE,
  icon: "TableRowRemoveCenter",
  tagline: "Row is deleted from {{inputs.enriched.table.name}}",
  description: "Fired when a row is deleted from your database",
  stepId: AutomationTriggerStepId.ROW_DELETED,
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
          description: "The row that was deleted",
        },
      },
      required: ["row"],
    },
  },
  type: AutomationStepType.TRIGGER,
}

export type RowDeletedTriggerInputs = {
  tableId: string
}

export type RowDeletedTriggerOutputs = {
  row: Row
}
