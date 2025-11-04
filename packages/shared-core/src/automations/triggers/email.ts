import {
  AutomationIOType,
  AutomationStepType,
  AutomationTriggerDefinition,
  AutomationTriggerStepId,
  AutomationEventType,
} from "@budibase/types"

export const definition: AutomationTriggerDefinition = {
  name: "Email",
  event: AutomationEventType.EMAIL_TRIGGER,
  icon: "envelope",
  tagline: "Email Trigger",
  description: "Triggers automation when an email is received",
  stepId: AutomationTriggerStepId.EMAIL,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        from: {
          type: AutomationIOType.STRING,
          title: "From:",
          description: "Leave empty to react to any sender",
        },
      },
    },
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
        subject: {
          type: AutomationIOType.STRING,
          description: "What was the subject of the email",
        },
        sentAt: {
          type: AutomationIOType.DATETIME,
          description: "When the email was sent",
        },
      },
      required: ["from", "to"],
    },
  },
  type: AutomationStepType.TRIGGER,
}
