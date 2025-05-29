import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Translate",
  tagline: "Translate text to a different language",
  icon: "GlobeGrid",
  description: "Translate text to a different language.",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.TRANSLATE,
  inputs: {
    prompt: "",
  },
  schema: {
    inputs: {
      properties: {
        text: {
          type: AutomationIOType.STRING,
          title: "Text",
        },
        language: {
          type: AutomationIOType.STRING,
          title: "Language",
        },
      },
      required: ["text", "language"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        response: {
          type: AutomationIOType.STRING,
          description: "What was the translated text",
        },
      },
      required: ["success", "response"],
    },
  },
}
