import { search as stringSearch } from "./utils"
import * as controller from "../view"
import { ViewV2, UserCtx } from "@budibase/types"
import { Next } from "koa"
import { merge } from "lodash"

function fixView(view: ViewV2, params?: { viewId: string }) {
  if (!params || !view) {
    return view
  }
  if (params?.viewId) {
    view.id = params.viewId
  }
  if (!view.query) {
    view.query = {}
  }
  view.version = 2
  return view
}

export async function search(ctx: UserCtx, next: Next) {
  const { name } = ctx.request.body
  await controller.v2.fetch(ctx)
  ctx.body = stringSearch(ctx.body.data, name)
  await next()
}

export async function create(ctx: UserCtx, next: Next) {
  await controller.v2.create(
    merge(ctx, {
      request: {
        body: fixView(ctx.request.body),
      },
    })
  )
  await next()
}

export async function read(ctx: UserCtx, next: Next) {
  await controller.v2.get(
    merge(ctx, {
      params: {
        viewId: ctx.params.viewId,
      },
    })
  )
  await next()
}

export async function update(ctx: UserCtx, next: Next) {
  const viewId = ctx.params.viewId
  await controller.v2.update(
    merge(ctx, {
      request: {
        body: {
          data: fixView(ctx.request.body, { viewId }),
        },
      },
      params: {
        viewId,
      },
    })
  )
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
