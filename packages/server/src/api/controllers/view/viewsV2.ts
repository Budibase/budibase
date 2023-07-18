import sdk from "../../../sdk"
import {
  CreateViewRequest,
  Ctx,
  FetchViewResponse,
  ViewResponse,
  ViewV2,
} from "@budibase/types"

export async function fetch(ctx: Ctx<void, FetchViewResponse>) {
  const { tableId } = ctx.query

  if (tableId && typeof tableId !== "string") {
    ctx.throw(400, "tableId type is not valid")
  }

  const views = tableId
    ? await sdk.views.findByTable(tableId)
    : await sdk.views.fetch()

  ctx.body = { views }
}

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

export async function save(ctx: Ctx<CreateViewRequest, ViewResponse>) {
  const view = ctx.request.body

  const result = await sdk.views.save(view)
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
