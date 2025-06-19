import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Extract Text Data",
  icon: "TextAlignLeft",
  tagline: "Extract structured data from text using AI",
  description:
    "Extracts structured data from plain text according to provided schema.",
  stepId: AutomationActionStepId.EXTRACT_TEXT_DATA,
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        text: {
          type: AutomationIOType.STRING,
          title: "Text Content",
          description: "The text content to extract data from.",
        },
        schema: {
          customType: AutomationCustomIOType.TRIGGER_SCHEMA,
          title: "Data schema",
          description:
            'Schema defining the structure of data to extract. Example: {"name": "string", "price": "number"}.',
        },
      },
      required: ["text", "schema"],
    },
    outputs: {
      properties: {
        data: {
          type: AutomationIOType.JSON,
          description: "The structured data extracted from the text.",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the extraction was successful.",
        },
      },
      required: ["data", "success"],
    },
  },
  type: AutomationStepType.ACTION,
}
