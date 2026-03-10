import execa from "execa"
import { findHBSBlocks, processStringSync } from "@budibase/string-templates"
import * as automationUtils from "../automationUtils"
import environment from "../../environment"
import { BashStepInputs, BashStepOutputs } from "@budibase/types"

const INVALID_INPUTS = "Budibase bash automation failed: Invalid inputs"
const COMMAND_BINDINGS_ERROR =
  "Budibase bash automation failed: Command bindings are not supported. Use the args field for dynamic values."
const ARGS_VALIDATION_ERROR =
  "Budibase bash automation failed: Args must be a JSON array of strings."

const processArgs = (args: string[] | undefined, context: object) => {
  if (args == null) {
    return []
  }

  if (!Array.isArray(args) || args.some(arg => typeof arg !== "string")) {
    throw new Error(ARGS_VALIDATION_ERROR)
  }

  return args.map(arg => processStringSync(arg, context))
}

export async function run({
  inputs,
  context,
}: {
  inputs: BashStepInputs
  context: object
}): Promise<BashStepOutputs> {
  if (inputs.command == null) {
    return {
      stdout: INVALID_INPUTS,
    }
  }

  try {
    if (findHBSBlocks(inputs.command).length > 0) {
      return {
        success: false,
        stdout: COMMAND_BINDINGS_ERROR,
        response: {
          message: COMMAND_BINDINGS_ERROR,
        },
      }
    }

    const command = inputs.command.trim()
    if (!command) {
      return {
        stdout: INVALID_INPUTS,
      }
    }

    const args = processArgs(inputs.args, context)

    let stdout,
      success = true
    try {
      stdout = execa.sync(command, args, {
        timeout: environment.QUERY_THREAD_TIMEOUT,
        stripFinalNewline: false,
      }).stdout
    } catch (err: any) {
      stdout = err.stderr || err.stdout || err.message
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
