import {
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepType,
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
          type: AutomationIOType.STRING,
          customType: AutomationCustomIOType.WEBHOOK_URL,
          title: "Schema URL",
        },
        triggerUrl: {
          type: AutomationIOType.STRING,
          customType: AutomationCustomIOType.WEBHOOK_URL,
          title: "Trigger URL",
        },
      },
      required: ["schemaUrl", "triggerUrl"],
    },
    outputs: {
      properties: {
        body: {
          type: AutomationIOType.OBJECT,
          description: "Body of the request which hit the webhook",
        },
      },
      required: ["body"],
    },
  },
  type: AutomationStepType.TRIGGER,
}
