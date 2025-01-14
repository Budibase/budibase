import * as automationUtils from "../automationUtils"
import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
  ExecuteScriptStepInputs,
  ExecuteScriptStepOutputs,
} from "@budibase/types"
import { processStringSync } from "@budibase/string-templates"

export const definition: AutomationStepDefinition = {
  name: "JS Scripting",
  tagline: "Execute JavaScript Code",
  icon: "Code",
  description: "Run a piece of JavaScript code in your automation",
  type: AutomationStepType.ACTION,
  internal: true,
  new: true,
  stepId: AutomationActionStepId.EXECUTE_SCRIPT_V2,
  inputs: {},
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  schema: {
    inputs: {
      properties: {
        code: {
          type: AutomationIOType.STRING,
          customType: AutomationCustomIOType.CODE,
          title: "Code",
        },
      },
      required: ["code"],
    },
    outputs: {
      properties: {
        value: {
          type: AutomationIOType.STRING,
          description: "The result of the return statement",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
      },
      required: ["success"],
    },
  },
}

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
      value: processStringSync(inputs.code, context),
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
