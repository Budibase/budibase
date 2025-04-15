import {
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepType,
  AutomationTriggerDefinition,
  AutomationTriggerStepId,
  AutomationEventType,
} from "@budibase/types"

export const definition: AutomationTriggerDefinition = {
  name: "Cron Trigger",
  event: AutomationEventType.CRON_TRIGGER,
  icon: "Clock",
  tagline: "Cron Trigger (<b>{{inputs.cron}}</b>)",
  description: "Triggers automation on a cron schedule.",
  stepId: AutomationTriggerStepId.CRON,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        cron: {
          type: AutomationIOType.STRING,
          customType: AutomationCustomIOType.CRON,
          title: "Expression",
        },
      },
      required: ["cron"],
    },
    outputs: {
      properties: {
        timestamp: {
          type: AutomationIOType.NUMBER,
          description: "Timestamp the cron was executed",
        },
      },
      required: ["timestamp"],
    },
  },
  type: AutomationStepType.TRIGGER,
}
