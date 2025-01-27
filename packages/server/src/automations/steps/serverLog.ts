import { ServerLogStepInputs, ServerLogStepOutputs } from "@budibase/types"

export async function run({
  inputs,
  appId,
}: {
  inputs: ServerLogStepInputs
  appId: string
}): Promise<ServerLogStepOutputs> {
  if (typeof inputs.text !== "string") {
    inputs.text = JSON.stringify(inputs.text)
  }
  const message = `App ${appId} - ${inputs.text}`
  console.log(message)
  return {
    success: true,
    message,
  }
}
