import { wait } from "../../utilities"
import {
  AutomationActionStepId,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
  DelayStepInputs,
  DelayStepOutputs,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
  name: "Delay",
  icon: "Clock",
  tagline: "Delay for {{inputs.time}} milliseconds",
  description: "Delay the automation until an amount of time has passed",
  stepId: AutomationActionStepId.DELAY,
  internal: true,
  features: {},
  inputs: {},
  schema: {
    inputs: {
      properties: {
        time: {
          type: AutomationIOType.NUMBER,
          title: "Delay in milliseconds",
        },
      },
      required: ["time"],
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

export async function run({
  inputs,
}: {
  inputs: DelayStepInputs
}): Promise<DelayStepOutputs> {
  await wait(inputs.time)
  return {
    success: true,
  }
}
