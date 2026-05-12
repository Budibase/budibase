import {
  RowActionTriggerRequest,
  Ctx,
  RowActionTriggerResponse,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function run(
  ctx: Ctx<RowActionTriggerRequest, RowActionTriggerResponse>
) {
  const { tableId, actionId, sourceId } = ctx.params
  const { rowId } = ctx.request.body

  await sdk.rowActions.run(tableId, actionId, rowId, ctx.user, sourceId)
  ctx.body = { message: "Row action triggered." }
}
