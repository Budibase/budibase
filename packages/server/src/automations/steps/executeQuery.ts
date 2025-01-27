import * as queryController from "../../api/controllers/query"
import { buildCtx } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  ContextEmitter,
  ExecuteQueryStepInputs,
  ExecuteQueryStepOutputs,
} from "@budibase/types"

export async function run({
  inputs,
  appId,
  emitter,
}: {
  inputs: ExecuteQueryStepInputs
  appId: string
  emitter: ContextEmitter
}): Promise<ExecuteQueryStepOutputs> {
  if (inputs.query == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  const { queryId, ...rest } = inputs.query

  const ctx: any = buildCtx(appId, emitter, {
    body: {
      parameters: rest,
    },
    params: {
      queryId,
    },
  })

  try {
    await queryController.executeV2AsAutomation(ctx)
    const { data, ...rest } = ctx.body

    return {
      response: data,
      info: rest,
      success: true,
    }
  } catch (err) {
    return {
      success: false,
      info: {},
      response: automationUtils.getError(err),
    }
  }
}
