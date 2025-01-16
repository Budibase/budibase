import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Slack Message",
  tagline: "Send a message to Slack",
  description: "Send a message to Slack",
  icon: "ri-slack-line",
  stepId: AutomationActionStepId.slack,
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
          title: "Incoming Webhook URL",
        },
        text: {
          type: AutomationIOType.STRING,
          title: "Message",
        },
      },
      required: ["url", "text"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: AutomationIOType.NUMBER,
          description: "The HTTP status code of the request",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the message sent successfully",
        },
        response: {
          type: AutomationIOType.STRING,
          description: "The response from the Slack Webhook",
        },
      },
    },
  },
}
