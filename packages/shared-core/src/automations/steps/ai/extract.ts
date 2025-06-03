import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
  DocumentSourceType,
  SupportedFileType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Extract Document Data",
  icon: "Document",
  tagline: "Extract structured data from documents using AI",
  description:
    "Extracts structured data from PDF or image according to provided schema.",
  stepId: AutomationActionStepId.EXTRACT_FILE_DATA,
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        file: {
          type: AutomationIOType.STRING,
          title: "Document",
          description:
            "Attachment or Link to the document to extract data from.",
        },
        source: {
          type: AutomationIOType.STRING,
          enum: Object.values(DocumentSourceType),
          title: "Source",
          description: "The source of the document to extract data from.",
        },
        fileType: {
          dependsOn: { field: "source", value: "URL" },
          type: AutomationIOType.STRING,
          enum: Object.values(SupportedFileType),
          title: "File Type",
          description: "The type of file at the URL.",
        },
        schema: {
          customType: AutomationCustomIOType.TRIGGER_SCHEMA,
          title: "Data schema",
          description:
            'Schema defining the structure of data to extract. Example: {"name": "string", "price": "number"}.',
        },
      },
      required: ["file", "schema"],
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
