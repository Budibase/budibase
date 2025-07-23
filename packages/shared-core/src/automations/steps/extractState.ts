import {
  AutomationActionStepId,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "State",
  tagline: "Extract automation state",
  icon: "brackets-curly",
  description: "Extract automation state into a named variable",
  type: AutomationStepType.ACTION,
  internal: true,
  new: false,
  stepId: AutomationActionStepId.EXTRACT_STATE,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        name: {
          type: AutomationIOType.STRING,
          title: "Name",
        },
        code: {
          type: AutomationIOType.LONGFORM,
          title: "Code",
        },
      },
      required: ["code", "name"],
    },
    outputs: {
      properties: {
        value: {
          type: AutomationIOType.STRING, // could be string or an object
          description: "The result of the return statement",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
      },
      required: ["success"],
    },
  },
}
