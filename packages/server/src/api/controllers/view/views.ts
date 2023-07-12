import { DocumentType, SEPARATOR } from "@budibase/backend-core"
import sdk from "../../../sdk"
import { Ctx, ViewV2 } from "@budibase/types"

export async function fetch(ctx: Ctx) {
  ctx.body = { views: await sdk.views.fetch() }
}

export async function find(ctx: Ctx) {
  const viewId = `${DocumentType.VIEW}${SEPARATOR}${ctx.params.viewId}`
  ctx.body = await sdk.views.get(viewId)
}

export async function findByTable(ctx: Ctx) {
  const tableId = `${DocumentType.TABLE}${SEPARATOR}${ctx.params.tableId}`
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
