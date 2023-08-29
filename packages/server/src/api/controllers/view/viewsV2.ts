import sdk from "../../../sdk"
import {
  CreateViewRequest,
  Ctx,
  RequiredKeys,
  UIFieldMetadata,
  UpdateViewRequest,
  ViewResponse,
  ViewV2,
} from "@budibase/types"
import { builderSocket, gridSocket } from "../../../websockets"

async function parseSchema(view: CreateViewRequest) {
  if (!view.schema) {
    return
  }
  const finalViewSchema =
    view.schema &&
    Object.entries(view.schema).reduce((p, [fieldName, schemaValue]) => {
      const fieldSchema: RequiredKeys<UIFieldMetadata> = {
        order: schemaValue.order,
        width: schemaValue.width,
        visible: schemaValue.visible,
        icon: schemaValue.icon,
      }
      Object.entries(fieldSchema)
        .filter(([_, val]) => val === undefined)
        .forEach(([key]) => {
          delete fieldSchema[key as keyof UIFieldMetadata]
        })
      p[fieldName] = fieldSchema
      return p
    }, {} as Record<string, RequiredKeys<UIFieldMetadata>>)
  for (let [key, column] of Object.entries(finalViewSchema)) {
    if (!column.visible) {
      delete finalViewSchema[key]
    }
  }
  return finalViewSchema
}

export async function get(ctx: Ctx<void, ViewResponse>) {
  ctx.body = {
    data: await sdk.views.get(ctx.params.viewId, { enriched: true }),
  }
}

export async function create(ctx: Ctx<CreateViewRequest, ViewResponse>) {
  const view = ctx.request.body
  const { tableId } = view

  const schema = await parseSchema(view)

  const parsedView: Omit<RequiredKeys<ViewV2>, "id" | "version"> = {
    name: view.name,
    tableId: view.tableId,
    query: view.query,
    sort: view.sort,
    schema,
    primaryDisplay: view.primaryDisplay,
  }
  const result = await sdk.views.create(tableId, parsedView)
  ctx.status = 201
  ctx.body = {
    data: result,
  }

  const table = await sdk.tables.getTable(tableId)
  builderSocket?.emitTableUpdate(ctx, table)
  gridSocket?.emitViewUpdate(ctx, result)
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

  const schema = await parseSchema(view)
  const parsedView: RequiredKeys<ViewV2> = {
    id: view.id,
    name: view.name,
    version: view.version,
    tableId: view.tableId,
    query: view.query,
    sort: view.sort,
    schema,
    primaryDisplay: view.primaryDisplay,
  }

  const result = await sdk.views.update(tableId, parsedView)
  ctx.body = {
    data: result,
  }

  const table = await sdk.tables.getTable(tableId)
  builderSocket?.emitTableUpdate(ctx, table)
  gridSocket?.emitViewUpdate(ctx, result)
}

export async function remove(ctx: Ctx) {
  const { viewId } = ctx.params

  const view = await sdk.views.remove(viewId)
  ctx.status = 204

  const table = await sdk.tables.getTable(view.tableId)
  builderSocket?.emitTableUpdate(ctx, table)
  gridSocket?.emitViewDeletion(ctx, view)
}
