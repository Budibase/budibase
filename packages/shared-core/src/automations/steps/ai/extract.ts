import {
  AutomationActionStepId,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Extract Document Data",
  icon: "Document",
  tagline: "Extract structured data from documents using AI",
  description:
    "Extracts structured data from PDF or image according to provided schema.",
  stepId: AutomationActionStepId.EXTRACT_DOCUMENT_DATA,
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        documentUrl: {
          type: AutomationIOType.STRING,
          title: "Document URL",
          description: "URL or path to the PDF or image to extract data from.",
        },
        schema: {
          type: AutomationIOType.JSON,
          title: "Data Schema",
          description:
            'Schema defining the structure of data to extract. Example: {"name": "string", "price": "number"}',
        },
      },
      required: ["documentUrl", "schema"],
    },
    outputs: {
      properties: {
        data: {
          type: AutomationIOType.JSON,
          description: "The structured data extracted from the document.",
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
