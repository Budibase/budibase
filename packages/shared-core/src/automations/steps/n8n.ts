import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
  HttpMethod,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "n8n Integration",
  stepTitle: "n8n",
  tagline: "Trigger an n8n workflow",
  description:
    "Performs a webhook call to n8n and gets the response (if configured)",
  icon: "ri-shut-down-line",
  stepId: AutomationActionStepId.n8n,
  type: AutomationStepType.ACTION,
  internal: false,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: AutomationIOType.STRING,
          title: "Webhook URL",
        },
        method: {
          type: AutomationIOType.STRING,
          title: "Method",
          enum: Object.values(HttpMethod),
        },
        authorization: {
          type: AutomationIOType.STRING,
          title: "Authorization",
        },
        body: {
          type: AutomationIOType.JSON,
          title: "Payload",
        },
      },
      required: ["url", "method"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether call was successful",
        },
        httpStatus: {
          type: AutomationIOType.NUMBER,
          description: "The HTTP status code returned",
        },
        response: {
          type: AutomationIOType.OBJECT,
          description: "The webhook response - this can have properties",
        },
      },
      required: ["success", "response"],
    },
  },
}
