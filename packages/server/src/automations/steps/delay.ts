import { wait } from "../../utilities"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "Delay",
  icon: "Clock",
  tagline: "Delay for {{inputs.time}} milliseconds",
  description: "Delay the automation until an amount of time has passed",
  stepId: AutomationActionStepId.DELAY,
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        time: {
          type: "number",
          title: "Delay in milliseconds",
        },
      },
      required: ["time"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether the delay was successful",
        },
      },
      required: ["success"],
    },
  },
  type: "LOGIC",
}

export async function run({ inputs }: AutomationStepInput) {
  await wait(inputs.time)
  return {
    success: true,
  }
}
