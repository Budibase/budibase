import type { DelayStepInputs, DelayStepOutputs } from "@budibase/types"

import { wait } from "../../utilities"

export const TEST_DELAY_CAP_MS = 3000

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

export const getCappedTestDelayMs = (inputs: DelayStepInputs) => {
  return Math.min(getDelayMs(inputs), TEST_DELAY_CAP_MS)
}

export async function run({
  inputs,
  isTestRun,
}: {
  inputs: DelayStepInputs
  isTestRun?: boolean
}): Promise<DelayStepOutputs> {
  await wait(isTestRun ? getCappedTestDelayMs(inputs) : getDelayMs(inputs))
  return {
    success: true,
  }
}
