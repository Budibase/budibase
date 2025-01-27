import { CollectStepInputs, CollectStepOutputs } from "@budibase/types"

export async function run({
  inputs,
}: {
  inputs: CollectStepInputs
}): Promise<CollectStepOutputs> {
  if (!inputs.collection) {
    return {
      success: false,
    }
  } else {
    return {
      success: true,
      value: inputs.collection,
    }
  }
}
