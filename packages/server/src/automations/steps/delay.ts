import { wait } from "../../utilities"
import { DelayStepInputs, DelayStepOutputs } from "@budibase/types"

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
