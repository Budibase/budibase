import sdk from "../../../sdk"
import { Ctx, ViewV2 } from "@budibase/types"

export async function fetch(ctx: Ctx) {
  const { tableId } = ctx.query

  if (tableId && typeof tableId !== "string") {
    ctx.throw(400, "tableId type is not valid")
  }

  const views = tableId
    ? await sdk.views.findByTable(tableId)
    : await sdk.views.fetch()

  ctx.body = { views }
}

export async function find(ctx: Ctx) {
  const { viewId } = ctx.params

  const result = await sdk.views.get(viewId)
  ctx.body = result
}

export async function save(ctx: Ctx<ViewV2>) {
  const view = ctx.request.body
  const result = await sdk.views.save(view)
  ctx.body = {
    ...view,
    ...result,
  }
}

export async function remove(ctx: Ctx) {
  const { viewId } = ctx.params
  const { _rev } = await sdk.views.get(viewId)

  await sdk.views.remove(viewId, _rev)
  ctx.status = 204
}
