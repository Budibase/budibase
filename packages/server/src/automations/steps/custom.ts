import {
  ContextEmitter,
  CustomStepInputs,
  CustomStepOutputs,
} from "@budibase/types"

export async function run({
  inputs,
}: {
  inputs: CustomStepInputs
  appId: string
  emitter: ContextEmitter
}): Promise<CustomStepOutputs> {
  return inputs.fn()
}
