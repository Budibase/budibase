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
  let { value } = inputs

  if (value == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  value = value.trim()

  try {
    return {
      success: true,
      value: processStringSync(inputs.value, context, { noThrow: false }),
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
