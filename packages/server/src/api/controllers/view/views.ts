import { DocumentType, SEPARATOR } from "@budibase/backend-core"
import sdk from "../../../sdk"
import { Ctx, ViewV2 } from "@budibase/types"

export async function fetch(ctx: Ctx) {
  ctx.body = { views: await sdk.views.fetch() }
}

export async function find(ctx: Ctx) {
  const { tableId, viewId } = ctx.params

  const result = await sdk.views.get(viewId)
  if (result?.tableId !== tableId) {
    ctx.throw(404)
  }
  ctx.body = result
}

export async function findByTable(ctx: Ctx) {
  const { tableId } = ctx.params
  ctx.body = { views: await sdk.views.findByTable(tableId) }
}

export async function save(ctx: Ctx<ViewV2>) {
  const view = ctx.request.body
  const result = await sdk.views.save(view)
  ctx.body = {
    ...view,
    ...result,
  }
}
