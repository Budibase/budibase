import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
} from "@budibase/types"

enum Model {
  GPT_4O_MINI = "gpt-4o-mini",
  GPT_4O = "gpt-4o",
  GPT_4 = "gpt-4",
  GPT_35_TURBO = "gpt-3.5-turbo",
}

export const definition: AutomationStepDefinition = {
  name: "OpenAI",
  tagline: "Send prompts to ChatGPT",
  icon: "Algorithm",
  description: "Interact with the OpenAI ChatGPT API.",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.OPENAI,
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
