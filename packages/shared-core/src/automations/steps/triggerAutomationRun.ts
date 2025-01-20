import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  AutomationCustomIOType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Trigger an automation",
  tagline: "Triggers an automation synchronously",
  icon: "Sync",
  description: "Triggers an automation synchronously",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.TRIGGER_AUTOMATION_RUN,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        automation: {
          type: AutomationIOType.OBJECT,
          properties: {
            automationId: {
              type: AutomationIOType.STRING,
              customType: AutomationCustomIOType.AUTOMATION,
            },
          },
          customType: AutomationCustomIOType.AUTOMATION_FIELDS,
          title: "automatioFields",
          required: ["automationId"],
        },
        timeout: {
          type: AutomationIOType.NUMBER,
          title: "Timeout (ms)",
        },
      },
      required: ["automationId"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the automation was successful",
        },
        value: {
          type: AutomationIOType.OBJECT,
          description: "Automation Result",
        },
      },
      required: ["success", "value"],
    },
  },
}
