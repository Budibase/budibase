import {
  AutomationActionStepId,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationCustomIOType,
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
          type: AutomationIOType.LONGFORM,
          title: "Text",
          description: "The text content you want the AI to classify.",
        },
        categoryItems: {
          type: AutomationIOType.ARRAY,
          customType: AutomationCustomIOType.CATEGORIES,
          title: "Categories",
          description:
            "Add categories for the AI to use when classifying text.",
        },
      },
      required: ["textInput", "categoryItems"],
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
