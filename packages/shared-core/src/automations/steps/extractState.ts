import {
  AutomationActionStepId,
  AutomationFeature,
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
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  schema: {
    inputs: {
      properties: {
        key: {
          type: AutomationIOType.STRING,
          title: "Key",
        },
        value: {
          type: AutomationIOType.LONGFORM,
          title: "Value",
        },
      },
      required: ["value", "key"],
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
