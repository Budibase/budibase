import * as scriptController from "../../api/controllers/script"
import { buildCtx } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepInput,
  AutomationStepSchema,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "JS Scripting",
  tagline: "Execute JavaScript Code",
  icon: "Code",
  description: "Run a piece of JavaScript code in your automation",
  type: AutomationStepType.ACTION,
  internal: true,
  stepId: AutomationActionStepId.EXECUTE_SCRIPT,
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
  appId,
  context,
  emitter,
}: AutomationStepInput) {
  if (inputs.code == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  const ctx: any = buildCtx(appId, emitter, {
    body: {
      script: inputs.code,
      context,
    },
  })

  try {
    await scriptController.execute(ctx)
    return {
      success: true,
      value: ctx.body,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
