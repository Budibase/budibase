import {
  AutomationActionStepId,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Run Function",
  tagline: "Run a Function",
  icon: "functions",
  description: "Run a Function in this automation",
  type: AutomationStepType.ACTION,
  stepId: AutomationActionStepId.EXECUTE_FUNCTION,
  internal: true,
  new: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  inputs: {},
  schema: {
    inputs: {
      properties: {
        functionId: {
          type: AutomationIOType.STRING,
          title: "Function ID",
          description: "The Function to run",
        },
        inputs: {
          type: AutomationIOType.JSON,
          title: "Inputs",
          description: "The JSON-compatible inputs passed to the Function",
        },
      },
      required: ["functionId", "inputs"],
    },
    outputs: {
      properties: {
        output: {
          type: AutomationIOType.JSON,
          description: "The Function output",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the Function completed successfully",
        },
        status: {
          type: AutomationIOType.STRING,
          description: "The Function run status",
        },
        error: {
          type: AutomationIOType.OBJECT,
          description: "The stable Function error",
        },
      },
      required: ["success", "status"],
    },
  },
}
