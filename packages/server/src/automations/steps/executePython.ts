import * as scriptController from "../../api/controllers/script"
import { buildCtx } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  ContextEmitter,
  ExecutePythonStepInputs,
  ExecutePythonStepOutputs,
} from "@budibase/types"
import { processStringSync } from "@budibase/string-templates"

export async function run({
  inputs,
  appId,
  context,
  emitter,
}: {
  inputs: ExecutePythonStepInputs
  appId: string
  context: object
  emitter: ContextEmitter
}): Promise<ExecutePythonStepOutputs> {
  if (inputs.code == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  let renderedCode: string

  try {
    // Pre-process any Handlebars placeholders inside the Python source.
    renderedCode = processStringSync(inputs.code, context, {
      noThrow: false,
    })
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }

  const ctx: any = buildCtx(appId, emitter, {
    body: {
      script: renderedCode,
      context,
      language: "python",
    },
  })
  console.log(ctx)
  try {
    await scriptController.executePython(ctx)
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
