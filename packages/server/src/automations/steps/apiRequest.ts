import * as queryController from "../../api/controllers/query"
import { buildCtx } from "./utils"
import * as automationUtils from "../automationUtils"
import {
  type APIRequestStepInputs,
  type APIRequestStepOutputs,
  ContextEmitter,
} from "@budibase/types"

export async function run({
  inputs,
  appId,
  emitter,
  context,
}: {
  inputs: APIRequestStepInputs
  appId: string
  emitter: ContextEmitter
  context: Record<string, any>
}): Promise<APIRequestStepOutputs> {
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
    user: context.user,
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
