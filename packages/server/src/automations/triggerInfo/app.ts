import {
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepType,
  AutomationTriggerSchema,
  AutomationTriggerStepId,
} from "@budibase/types"

export const definition: AutomationTriggerSchema = {
  name: "App Action",
  event: "app:trigger",
  icon: "Apps",
  tagline: "Automation fired from the frontend",
  description: "Trigger an automation from an action inside your app",
  stepId: AutomationTriggerStepId.APP,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        fields: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.TRIGGER_SCHEMA,
          title: "Fields",
        },
      },
      required: [],
    },
    outputs: {
      properties: {
        fields: {
          type: AutomationIOType.OBJECT,
          description: "Fields submitted from the app frontend",
          customType: AutomationCustomIOType.TRIGGER_SCHEMA,
        },
      },
      required: ["fields"],
    },
  },
  type: AutomationStepType.TRIGGER,
}
