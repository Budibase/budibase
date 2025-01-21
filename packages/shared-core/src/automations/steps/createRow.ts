import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Create Row",
  tagline: "Create a {{inputs.enriched.table.name}} row",
  icon: "TableRowAddBottom",
  description: "Add a row to your database",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  stepId: AutomationActionStepId.CREATE_ROW,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        row: {
          type: AutomationIOType.OBJECT,
          properties: {
            tableId: {
              type: AutomationIOType.STRING,
              customType: AutomationCustomIOType.TABLE,
            },
          },
          customType: AutomationCustomIOType.ROW,
          title: "Table",
          required: ["tableId"],
        },
      },
      required: ["row"],
    },
    outputs: {
      properties: {
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          description: "The new row",
        },
        response: {
          type: AutomationIOType.OBJECT,
          description: "The response from the table",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the row creation was successful",
        },
        id: {
          type: AutomationIOType.STRING,
          description: "The identifier of the new row",
        },
        revision: {
          type: AutomationIOType.STRING,
          description: "The revision of the new row",
        },
      },
      required: ["success", "id", "revision"],
    },
  },
}
