import {
  AutomationTriggerSchema,
  AutomationTriggerStepId,
} from "@budibase/types"

export const definition: AutomationTriggerSchema = {
  name: "Webhook",
  event: "web:trigger",
  icon: "Send",
  tagline: "Webhook endpoint is hit",
  description: "Trigger an automation when a HTTP POST webhook is hit",
  stepId: AutomationTriggerStepId.WEBHOOK,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        schemaUrl: {
          type: "string",
          customType: "webhookUrl",
          title: "Schema URL",
        },
        triggerUrl: {
          type: "string",
          customType: "webhookUrl",
          title: "Trigger URL",
        },
      },
      required: ["schemaUrl", "triggerUrl"],
    },
    outputs: {
      properties: {
        body: {
          type: "object",
          description: "Body of the request which hit the webhook",
        },
      },
      required: ["body"],
    },
  },
  type: "TRIGGER",
}
