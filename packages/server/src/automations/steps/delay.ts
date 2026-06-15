import type { DelayStepInputs, DelayStepOutputs } from "@budibase/types"

import { wait } from "../../utilities"

type DelayUnit = NonNullable<DelayStepInputs["unit"]>

const delayUnitToMs: Record<DelayUnit, number> = {
  milliseconds: 1,
  seconds: 1000,
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
}

export const getDelayMs = (inputs: DelayStepInputs) => {
  return inputs.time * delayUnitToMs[inputs.unit || "milliseconds"]
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
