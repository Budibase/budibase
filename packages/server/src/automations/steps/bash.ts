import { execSync } from "child_process"
import { processStringSync } from "@budibase/string-templates"
import * as automationUtils from "../automationUtils"
import environment from "../../environment"
import { BashStepInputs, BashStepOutputs } from "@budibase/types"

export async function run({
  inputs,
  context,
}: {
  inputs: BashStepInputs
  context: object
}): Promise<BashStepOutputs> {
  if (inputs.code == null) {
    return {
      stdout: "Budibase bash automation failed: Invalid inputs",
    }
  }

  try {
    const command = processStringSync(inputs.code, context)

    let stdout,
      success = true
    try {
      stdout = execSync(command, {
        timeout: environment.QUERY_THREAD_TIMEOUT,
      }).toString()
    } catch (err: any) {
      stdout = err.message
      success = false
    }

    return {
      stdout,
      success,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
