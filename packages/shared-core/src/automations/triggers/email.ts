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
  tagline: "Email Trigger (<b>{{inputs.email_from}}</b>)",
  description: "Triggers automation when an email is received",
  stepId: AutomationTriggerStepId.EMAIL,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        from: {
          type: AutomationIOType.STRING,
          title: "From:",
        },
      },
      required: ["from"],
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
      },
      required: ["from", "to"],
    },
  },
  type: AutomationStepType.TRIGGER,
}
