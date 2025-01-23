import { destroy } from "../../api/controllers/row"
import { buildCtx } from "./utils"
import { getError } from "../automationUtils"
import {
  ContextEmitter,
  DeleteRowStepInputs,
  DeleteRowStepOutputs,
} from "@budibase/types"

export async function run({
  inputs,
  appId,
  emitter,
}: {
  inputs: DeleteRowStepInputs
  appId: string
  emitter: ContextEmitter
}): Promise<DeleteRowStepOutputs> {
  if (inputs.id == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  let ctx: any = buildCtx(appId, emitter, {
    body: {
      _id: inputs.id,
      _rev: inputs.revision,
    },
    params: {
      tableId: decodeURIComponent(inputs.tableId),
    },
  })

  try {
    await destroy(ctx)
    return {
      response: ctx.body,
      row: ctx.row,
      success: ctx.body.ok,
    }
  } catch (err) {
    return {
      success: false,
      response: getError(err),
    }
  }
}
