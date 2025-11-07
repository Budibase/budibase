import {
  AutomationIOType,
  AutomationStepType,
  AutomationTriggerDefinition,
  AutomationTriggerStepId,
  AutomationEventType,
} from "@budibase/types"

export const definition: AutomationTriggerDefinition = {
  name: "Email Received",
  event: AutomationEventType.EMAIL_TRIGGER,
  icon: "envelope",
  tagline: "Email Trigger",
  description: "Triggers automation when an email is received",
  stepId: AutomationTriggerStepId.EMAIL,
  inputs: {},
  schema: {
    inputs: { properties: {} },
    outputs: {
      properties: {
        from: {
          type: AutomationIOType.STRING,
          description: "Who sent the email",
        },
        to: {
          type: AutomationIOType.STRING,
          description: "Who received the email",
        },
        cc: {
          type: AutomationIOType.ARRAY,
          subtype: AutomationIOType.STRING,
          description: "Who was CC'd on the email",
        },
        subject: {
          type: AutomationIOType.STRING,
          description: "What was the subject of the email",
        },
        sentAt: {
          type: AutomationIOType.DATETIME,
          description: "When the email was sent",
        },
        bodyText: {
          type: AutomationIOType.STRING,
          description: "Email content (plain text)",
        },
      },
      required: ["from", "to"],
    },
  },
  type: AutomationStepType.TRIGGER,
}
