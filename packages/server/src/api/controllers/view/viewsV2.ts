import sdk from "../../../sdk"
import {
  CreateViewRequest,
  Ctx,
  ViewResponse,
  ViewSchemaResponse,
} from "@budibase/types"

export async function create(ctx: Ctx<CreateViewRequest, ViewResponse>) {
  const view = ctx.request.body
  const { tableId } = view

  const result = await sdk.views.create(tableId, view)
  ctx.status = 201
  ctx.body = {
    data: result,
  }
}

export async function remove(ctx: Ctx) {
  const { viewId } = ctx.params

  await sdk.views.remove(viewId)
  ctx.status = 204
}

export async function getSchema(ctx: Ctx<void, ViewSchemaResponse>) {
  const { viewId } = ctx.params

  const schema = await sdk.views.getSchema(viewId)
  ctx.body = { schema }
}
