import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Zapier Webhook",
  stepId: AutomationActionStepId.zapier,
  type: AutomationStepType.ACTION,
  internal: false,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  description: "Trigger a Zapier Zap via webhooks",
  tagline: "Trigger a Zapier Zap",
  icon: "ri-flashlight-line",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        url: {
          type: AutomationIOType.STRING,
          title: "Webhook URL",
        },
        body: {
          type: AutomationIOType.JSON,
          title: "Payload",
        },
      },
      required: ["url"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: AutomationIOType.NUMBER,
          description: "The HTTP status code of the request",
        },
        response: {
          type: AutomationIOType.STRING,
          description: "The response from Zapier",
        },
      },
    },
  },
}
