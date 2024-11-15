import { search as stringSearch } from "./utils"
import * as controller from "../view"
import { ViewV2, UserCtx, UISearchFilter, PublicAPIView } from "@budibase/types"
import { Next } from "koa"
import { merge } from "lodash"

function viewRequest(view: PublicAPIView, params?: { viewId: string }) {
  const viewV2: ViewV2 = view
  if (!viewV2) {
    return viewV2
  }
  if (params?.viewId) {
    viewV2.id = params.viewId
  }
  if (!view.query) {
    viewV2.query = {}
  } else {
    // public API only has one form of query
    viewV2.queryUI = viewV2.query as UISearchFilter
  }
  viewV2.version = 2
  return viewV2
}

function viewResponse(view: ViewV2): PublicAPIView {
  // remove our internal structure - always un-necessary
  delete view.query
  return {
    ...view,
    query: view.queryUI,
  }
}

function viewsResponse(views: ViewV2[]): PublicAPIView[] {
  return views.map(viewResponse)
}

export async function search(ctx: UserCtx, next: Next) {
  const { name } = ctx.request.body
  await controller.v2.fetch(ctx)
  ctx.body.data = viewsResponse(stringSearch(ctx.body.data, name))
  await next()
}

export async function create(ctx: UserCtx, next: Next) {
  ctx = merge(ctx, {
    request: {
      body: viewRequest(ctx.request.body),
    },
  })
  await controller.v2.create(ctx)
  ctx.body.data = viewResponse(ctx.body.data)
  await next()
}

export async function read(ctx: UserCtx, next: Next) {
  ctx = merge(ctx, {
    params: {
      viewId: ctx.params.viewId,
    },
  })
  await controller.v2.get(ctx)
  ctx.body.data = viewResponse(ctx.body.data)
  await next()
}

export async function update(ctx: UserCtx, next: Next) {
  const viewId = ctx.params.viewId
  ctx = merge(ctx, {
    request: {
      body: {
        data: viewRequest(ctx.request.body, { viewId }),
      },
    },
    params: {
      viewId,
    },
  })
  await controller.v2.update(ctx)
  ctx.body.data = viewResponse(ctx.body.data)
  await next()
}

export async function destroy(ctx: UserCtx, next: Next) {
  await controller.v2.remove(ctx)
  await next()
}

export default {
  create,
  read,
  update,
  destroy,
  search,
}
