import { Duration } from "@budibase/backend-core"
import type { DelayStepInputs, DelayStepOutputs } from "@budibase/types"
import { DurationType } from "@budibase/types"

import { wait } from "../../utilities"

export const TEST_DELAY_CAP_MS = 3000

export const getDelayMs = (inputs: DelayStepInputs) => {
  return Duration.from(
    inputs.unit || DurationType.MILLISECONDS,
    inputs.time
  ).toMs()
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
