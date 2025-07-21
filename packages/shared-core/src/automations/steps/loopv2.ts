import {
  AutomationActionStepId,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Loop",
  icon: "recycle",
  tagline: "Loop the block",
  description: "Loop",
  stepId: AutomationActionStepId.LOOP_V2,
  internal: true,
  features: {},
  inputs: {},
  schema: {
    inputs: {
      properties: {
        children: {
          type: AutomationIOType.ARRAY,
        },
        binding: {
          type: AutomationIOType.STRING,
          title: "Binding / Value",
        },
        iterations: {
          type: AutomationIOType.NUMBER,
          title: "Max loop iterations",
        },
        failure: {
          type: AutomationIOType.STRING,
          title: "Failure Condition",
        },
      },
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Loop success",
        },
      },
      required: ["success"],
    },
  },
  type: AutomationStepType.LOGIC,
}
