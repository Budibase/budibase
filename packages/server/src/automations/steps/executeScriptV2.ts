import * as automationUtils from "../automationUtils"
import {
  ExecuteScriptStepInputs,
  ExecuteScriptStepOutputs,
} from "@budibase/types"
import { processStringSync } from "@budibase/string-templates"

export async function run({
  inputs,
  context,
}: {
  inputs: ExecuteScriptStepInputs
  context: Record<string, any>
}): Promise<ExecuteScriptStepOutputs> {
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

  if (!code.startsWith("{{ js ")) {
    return {
      success: false,
      response: {
        message: "Expected code to be a {{ js }} template block",
      },
    }
  }

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
