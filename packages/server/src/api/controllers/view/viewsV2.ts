import sdk from "../../../sdk"
import { CreateViewRequest, Ctx, ViewResponse } from "@budibase/types"

export async function find(ctx: Ctx<void, ViewResponse>) {
  const { viewId } = ctx.params

  const view = await sdk.views.get(viewId)
  if (!view) {
    ctx.throw(404)
  }

  ctx.body = {
    data: view,
  }
}

export async function create(ctx: Ctx<CreateViewRequest, ViewResponse>) {
  const view = ctx.request.body

  const result = await sdk.views.create(view)
  ctx.status = 201
  ctx.body = {
    data: {
      ...view,
      ...result,
    },
  }
}

export async function remove(ctx: Ctx) {
  const { viewId } = ctx.params
  const doc = await sdk.views.get(viewId)
  if (!doc) {
    ctx.throw(404)
  }

  const { _rev } = doc

  await sdk.views.remove(viewId, _rev!)
  ctx.status = 204
}
