import {
  AutomationActionStepId,
  AutomationStepType,
  AutomationIOType,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationStepDefinition,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  description: "Delete a row from your database",
  icon: "TableRowRemoveCenter",
  name: "Delete Row",
  tagline: "Delete a {{inputs.enriched.table.name}} row",
  type: AutomationStepType.ACTION,
  stepId: AutomationActionStepId.DELETE_ROW,
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
        id: {
          type: AutomationIOType.STRING,
          title: "Row ID",
        },
      },
      required: ["tableId", "id"],
    },
    outputs: {
      properties: {
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          description: "The deleted row",
        },
        response: {
          type: AutomationIOType.OBJECT,
          description: "The response from the table",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the deletion was successful",
        },
      },
      required: ["row", "success"],
    },
  },
}
