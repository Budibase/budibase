import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Backend log",
  tagline: "Console log a value in the backend",
  icon: "Monitoring",
  description: "Logs the given text to the server (using console.log)",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  stepId: AutomationActionStepId.SERVER_LOG,
  inputs: {
    text: "",
  },
  schema: {
    inputs: {
      properties: {
        text: {
          type: AutomationIOType.STRING,
          title: "Log",
        },
      },
      required: ["text"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        message: {
          type: AutomationIOType.STRING,
          description: "What was output",
        },
      },
      required: ["success", "message"],
    },
  },
}
