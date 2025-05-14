import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  Model,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "LLM Prompt",
  tagline: "Send prompts to LLM",
  icon: "Algorithm",
  description: "Interact with an LLM.",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.PROMPT_LLM,
  inputs: {
    prompt: "",
  },
  schema: {
    inputs: {
      properties: {
        prompt: {
          type: AutomationIOType.STRING,
          title: "Prompt",
        },
        model: {
          type: AutomationIOType.STRING,
          title: "Model",
          enum: Object.values(Model),
        },
      },
      required: ["prompt", "model"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        response: {
          type: AutomationIOType.STRING,
          description: "What was output",
        },
      },
      required: ["success", "response"],
    },
  },
}
