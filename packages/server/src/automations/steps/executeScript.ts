import * as scriptController from "../../api/controllers/script"
import { buildCtx } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  ContextEmitter,
  ExecuteScriptStepInputs,
  ExecuteScriptStepOutputs,
} from "@budibase/types"

export async function run({
  inputs,
  appId,
  context,
  emitter,
}: {
  inputs: ExecuteScriptStepInputs
  appId: string
  context: object
  emitter: ContextEmitter
}): Promise<ExecuteScriptStepOutputs> {
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
