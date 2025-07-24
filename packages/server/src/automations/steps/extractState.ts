import * as automationUtils from "../automationUtils"
import {
  ExtractStateStepInputs,
  ExtractStateStepOutputs,
} from "@budibase/types"
import { processStringSync } from "@budibase/string-templates"

export async function run({
  inputs,
  context,
}: {
  inputs: ExtractStateStepInputs
  context: Record<string, any>
}): Promise<ExtractStateStepOutputs> {
  let { code } = inputs

  if (code == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  code = code.trim()

  try {
    return {
      success: true,
      value: processStringSync(inputs.code, context, { noThrow: false }),
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
