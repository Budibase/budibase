import {
  AutomationActionStepId,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

enum DelayUnit {
  MILLISECONDS = "milliseconds",
  SECONDS = "seconds",
  MINUTES = "minutes",
  HOURS = "hours",
  DAYS = "days",
}

const DelayUnitPretty = {
  [DelayUnit.MILLISECONDS]: "Milliseconds",
  [DelayUnit.SECONDS]: "Seconds",
  [DelayUnit.MINUTES]: "Minutes",
  [DelayUnit.HOURS]: "Hours",
  [DelayUnit.DAYS]: "Days",
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
    unit: DelayUnit.SECONDS,
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
          enum: Object.values(DelayUnit),
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
