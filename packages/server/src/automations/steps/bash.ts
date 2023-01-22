import { execSync } from "child_process"
import { processStringSync } from "@budibase/string-templates"
import * as automationUtils from "../automationUtils"
import environment from "../../environment"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "Bash Scripting",
  tagline: "Execute a bash command",
  icon: "JourneyEvent",
  description: "Run a bash script",
  type: "ACTION",
  internal: true,
  stepId: AutomationActionStepId.EXECUTE_BASH,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        code: {
          type: "string",
          customType: "code",
          title: "Code",
        },
      },
      required: ["code"],
    },
    outputs: {
      properties: {
        stdout: {
          type: "string",
          description: "Standard output of your bash command or script",
        },
        success: {
          type: "boolean",
          description: "Whether the command was successful",
        },
      },
    },
    required: ["stdout"],
  },
}

export async function run({ inputs, context }: AutomationStepInput) {
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
        timeout: environment.QUERY_THREAD_TIMEOUT || 500,
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
