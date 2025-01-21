import { save } from "../../api/controllers/row"
import {
  cleanUpRow,
  getError,
  sendAutomationAttachmentsToStorage,
} from "../automationUtils"
import { buildCtx } from "./utils"
import {
  ContextEmitter,
  CreateRowStepInputs,
  CreateRowStepOutputs,
} from "@budibase/types"

export async function run({
  inputs,
  appId,
  emitter,
}: {
  inputs: CreateRowStepInputs
  appId: string
  emitter: ContextEmitter
}): Promise<CreateRowStepOutputs> {
  if (inputs.row == null || inputs.row.tableId == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }
  // have to clean up the row, remove the table from it
  const ctx: any = buildCtx(appId, emitter, {
    body: inputs.row,
    params: {
      tableId: decodeURIComponent(inputs.row.tableId),
    },
  })
  try {
    inputs.row = await cleanUpRow(inputs.row.tableId, inputs.row)
    inputs.row = await sendAutomationAttachmentsToStorage(
      inputs.row.tableId!,
      inputs.row
    )
    await save(ctx)
    return {
      row: inputs.row,
      response: ctx.body,
      id: ctx.body._id,
      revision: ctx.body._rev,
      success: !!ctx.body._id,
    }
  } catch (err) {
    return {
      success: false,
      response: getError(err),
    }
  }
}
