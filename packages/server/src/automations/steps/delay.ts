import type { DelayStepInputs, DelayStepOutputs } from "@budibase/types"

import { wait } from "../../utilities"

const delayUnitToMs: Record<DelayStepInputs["unit"], number> = {
  milliseconds: 1,
  seconds: 1000,
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
}

export const getDelayMs = (inputs: DelayStepInputs) => {
  return inputs.time * delayUnitToMs[inputs.unit]
}

export async function run({
  inputs,
}: {
  inputs: DelayStepInputs
}): Promise<DelayStepOutputs> {
  await wait(getDelayMs(inputs))
  return {
    success: true,
  }
}
