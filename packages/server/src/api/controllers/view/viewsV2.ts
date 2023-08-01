import sdk from "../../../sdk"
import {
  CreateViewRequest,
  Ctx,
  UIFieldMetadata,
  UpdateViewRequest,
  ViewResponse,
  ViewV2,
  RequiredKeys,
} from "@budibase/types"

export async function create(ctx: Ctx<CreateViewRequest, ViewResponse>) {
  const view = ctx.request.body
  const { tableId } = view

  const schemaUI =
    view.schema &&
    Object.entries(view.schema).reduce((p, [fieldName, schemaValue]) => {
      p[fieldName] = {
        order: schemaValue.order,
        width: schemaValue.width,
        visible: schemaValue.visible,
        icon: schemaValue.icon,
      }
      return p
    }, {} as Record<string, RequiredKeys<UIFieldMetadata>>)

  const parsedView: Omit<ViewV2, "id" | "version"> = {
    name: view.name,
    tableId: view.tableId,
    query: view.query,
    sort: view.sort,
    columns: view.schema && Object.keys(view.schema),
    schemaUI,
  }
  const result = await sdk.views.create(tableId, parsedView)
  ctx.status = 201
  ctx.body = {
    data: result,
  }
}

export async function update(ctx: Ctx<UpdateViewRequest, ViewResponse>) {
  const view = ctx.request.body

  if (view.version !== 2) {
    ctx.throw(400, "Only views V2 can be updated")
  }

  if (ctx.params.viewId !== view.id) {
    ctx.throw(400, "View id does not match between the body and the uri path")
  }

  const { tableId } = view

  const result = await sdk.views.update(tableId, view)
  ctx.body = {
    data: result,
  }
}

export async function remove(ctx: Ctx) {
  const { viewId } = ctx.params

  await sdk.views.remove(viewId)
  ctx.status = 204
}
