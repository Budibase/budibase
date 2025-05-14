import {
  AutomationActionStepId,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Classify Text",
  icon: "PageTag",
  tagline: "Classify text into predefined categories using AI",
  description:
    "Analyzes text and assigns it to one of the categories you provide.",
  stepId: AutomationActionStepId.CLASSIFY_CONTENT,
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        textInput: {
          type: AutomationIOType.STRING,
          title: "Text to Classify",
          description: "The text content you want the AI to classify.",
        },
        categories: {
          type: AutomationIOType.STRING,
          title: "Categories",
          description:
            "A list of categories to classify the text against (e.g., Positive, Negative).",
        },
      },
      required: ["textInput", "categories"],
    },
    outputs: {
      properties: {
        category: {
          type: AutomationIOType.STRING,
          description: "The category assigned by the AI.",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the classification was successful.",
        },
      },
      required: ["category", "success"],
    },
  },
  type: AutomationStepType.ACTION,
}
