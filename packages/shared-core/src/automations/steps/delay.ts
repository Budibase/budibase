import {
  AutomationActionStepId,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
  DurationType,
} from "@budibase/types"

const DelayUnitPretty = {
  [DurationType.MILLISECONDS]: "Milliseconds",
  [DurationType.SECONDS]: "Seconds",
  [DurationType.MINUTES]: "Minutes",
  [DurationType.HOURS]: "Hours",
  [DurationType.DAYS]: "Days",
}

export const definition: AutomationStepDefinition = {
  name: "Delay",
  icon: "clock",
  tagline: "Delay for {{inputs.time}} {{inputs.unit}}",
  description: "Delay the automation until an amount of time has passed",
  stepId: AutomationActionStepId.DELAY,
  internal: true,
  features: {},
  inputs: {
    time: 10,
    unit: DurationType.SECONDS,
  },
  schema: {
    inputs: {
      properties: {
        time: {
          type: AutomationIOType.NUMBER,
          title: "Wait for",
        },
        unit: {
          type: AutomationIOType.STRING,
          title: "Unit",
          enum: Object.values(DurationType),
          pretty: Object.values(DelayUnitPretty),
        },
      },
      required: ["time", "unit"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the delay was successful",
        },
      },
      required: ["success"],
    },
  },
  type: AutomationStepType.LOGIC,
}
