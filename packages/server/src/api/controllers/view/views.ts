import sdk from "../../../sdk"
import { Ctx, ViewV2 } from "@budibase/types"

export async function fetch(ctx: Ctx) {
  ctx.body = { views: await sdk.views.fetch() }
}

export async function save(ctx: Ctx<ViewV2>) {
  const view = ctx.request.body
  ctx.body = await sdk.views.save(view)
}
