import { RowActionTriggerRequest, Ctx } from "@budibase/types"
import sdk from "../../../sdk"

export async function run(ctx: Ctx<RowActionTriggerRequest, void>) {
  const { tableId, actionId } = ctx.params
  const { rowId } = ctx.request.body

  await sdk.rowActions.run(tableId, actionId, rowId, ctx.user)
  ctx.status = 200
}
