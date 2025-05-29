import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
} from "@budibase/types"

enum SummariseLength {
  SHORT = "Short",
  MEDIUM = "Medium",
  LONG = "Long",
}

export const definition: AutomationStepDefinition = {
  name: "Summarise",
  tagline: "Summarise text",
  icon: "Summarize",
  description: "Summarise text.",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.SUMMARISE,
  inputs: {
    prompt: "",
  },
  schema: {
    inputs: {
      properties: {
        text: {
          type: AutomationIOType.LONGFORM,
          title: "Text",
        },
        length: {
          type: AutomationIOType.STRING,
          title: "Length",
          enum: Object.values(SummariseLength),
        },
      },
      required: ["text", "length"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        response: {
          type: AutomationIOType.STRING,
          description: "What was the summarised text",
        },
      },
      required: ["success", "response"],
    },
  },
}
