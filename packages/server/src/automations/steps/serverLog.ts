import { processStringSync } from "@budibase/string-templates"
import { ServerLogStepInputs, ServerLogStepOutputs } from "@budibase/types"
import * as automationUtils from "../automationUtils"

export async function run({
  inputs,
  appId,
  context,
}: {
  inputs: ServerLogStepInputs
  appId: string
  context: Record<string, any>
}): Promise<ServerLogStepOutputs> {
  if (typeof inputs.text !== "string") {
    inputs.text = JSON.stringify(inputs.text)
  }
  let text
  try {
    text = processStringSync(inputs.text, context, { noThrow: false })
  } catch (err) {
    return {
      success: false,
      message: automationUtils.getError(err),
    }
  }
  const message = `App ${appId} - ${text}`
  console.log(message)
  return {
    success: true,
    message,
  }
}
