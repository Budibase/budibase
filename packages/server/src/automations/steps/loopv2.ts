import { LoopV2StepInputs, LoopV2StepOutputs } from "@budibase/types"

export async function run({
  inputs: _inputs,
}: {
  inputs: LoopV2StepInputs
}): Promise<LoopV2StepOutputs> {
  return {
    success: true,
  }
}
