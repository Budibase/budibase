import {
  AutomationActionStepId,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
  AutomationStepDefinition,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Discord Message",
  tagline: "Send a message to a Discord server",
  description: "Send a message to a Discord server",
  icon: "ri-discord-line",
  stepId: AutomationActionStepId.discord,
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
          title: "Discord Webhook URL",
        },
        username: {
          type: AutomationIOType.STRING,
          title: "Bot Name",
        },
        avatar_url: {
          type: AutomationIOType.STRING,
          title: "Bot Avatar URL",
        },
        content: {
          type: AutomationIOType.STRING,
          title: "Message",
        },
      },
      required: ["url", "content"],
    },
    outputs: {
      properties: {
        httpStatus: {
          type: AutomationIOType.NUMBER,
          description: "The HTTP status code of the request",
        },
        response: {
          type: AutomationIOType.STRING,
          description: "The response from the Discord Webhook",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the message sent successfully",
        },
      },
    },
  },
}
