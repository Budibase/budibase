import type { MergeStepInputs, MergeStepOutputs } from "@budibase/types"

export async function run({
  inputs: _inputs,
}: {
  inputs: MergeStepInputs
}): Promise<MergeStepOutputs> {
  return {
    success: true,
  }
}
