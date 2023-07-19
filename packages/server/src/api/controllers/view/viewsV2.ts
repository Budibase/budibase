import sdk from "../../../sdk"
import { CreateViewRequest, Ctx, ViewResponse } from "@budibase/types"

export async function create(ctx: Ctx<CreateViewRequest, ViewResponse>) {
  const { tableId } = ctx.params
  const view = ctx.request.body

  const result = await sdk.views.create(tableId, view)
  ctx.status = 201
  ctx.body = {
    data: result,
  }
}

export async function remove(ctx: Ctx) {
  const { tableId, viewId } = ctx.params

  await sdk.views.remove(tableId, viewId)
  ctx.status = 204
}
