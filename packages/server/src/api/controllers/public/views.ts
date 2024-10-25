import { search as stringSearch } from "./utils"
import * as controller from "../view"
import { ViewV2, UserCtx } from "@budibase/types"
import { Next } from "koa"

function fixView(view: ViewV2, params?: { viewId: string }) {
  if (!params || !view) {
    return view
  }
  if (params?.viewId) {
    view.id = params.viewId
  }
  if (!view.version) {
    view.version = 2
  }
  return view
}

export async function search(ctx: UserCtx, next: Next) {
  const { name } = ctx.request.body
  // TODO: need a view search endpoint
  // await controller.v2.fetch(ctx)
  ctx.body = stringSearch(ctx.body, name)
  await next()
}

export async function create(ctx: UserCtx, next: Next) {
  ctx.body = fixView(ctx.body)
  await controller.v2.create(ctx)
  await next()
}

export async function read(ctx: UserCtx, next: Next) {
  await controller.v2.get(ctx)
  await next()
}

export async function update(ctx: UserCtx, next: Next) {
  // TODO: this is more complex - no rev on views
  // ctx.request.body = await addRev(
  //   fixView(ctx.request.body, ctx.params),
  //   ctx.params.tableId
  // )
  await controller.v2.update(ctx)
  await next()
}

export async function destroy(ctx: UserCtx, next: Next) {
  await controller.v2.remove(ctx)
  ctx.body = ctx.table
  await next()
}

export default {
  create,
  read,
  update,
  destroy,
  search,
}
