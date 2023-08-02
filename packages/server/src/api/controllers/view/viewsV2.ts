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

async function parseSchemaUI(ctx: Ctx, view: CreateViewRequest) {
  if (!view.schema) {
    return
  }

  function hasOverrides(
    newObj: Record<string, any>,
    existingObj: Record<string, any>
  ) {
    const result = Object.entries(newObj).some(([key, value]) => {
      const isObject = typeof value === "object"
      const existing = existingObj[key]
      if (isObject && hasOverrides(value, existing || {})) {
        return true
      }
      if (!isObject && value !== existing) {
        return true
      }
    })

    return result
  }

  const table = await sdk.tables.getTable(view.tableId)
  for (const [
    fieldName,
    { order, width, visible, icon, ...schemaNonUI },
  ] of Object.entries(view.schema)) {
    const overrides = hasOverrides(schemaNonUI, table.schema[fieldName])
    if (overrides) {
      ctx.throw(
        400,
        "This endpoint does not support overriding non UI fields in the schema"
      )
    }
  }

  const schemaUI =
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
  return schemaUI
}

export async function create(ctx: Ctx<CreateViewRequest, ViewResponse>) {
  const view = ctx.request.body
  const { tableId } = view

  const schemaUI = await parseSchemaUI(ctx, view)

  const parsedView: Omit<RequiredKeys<ViewV2>, "id" | "version"> = {
    name: view.name,
    tableId: view.tableId,
    query: view.query,
    sort: view.sort,
    columns: view.schema && Object.keys(view.schema),
    schemaUI,
    primaryDisplay: view.primaryDisplay,
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

  const schemaUI = await parseSchemaUI(ctx, view)
  const parsedView: RequiredKeys<ViewV2> = {
    id: view.id,
    name: view.name,
    version: view.version,
    tableId: view.tableId,
    query: view.query,
    sort: view.sort,
    columns: view.schema && Object.keys(view.schema),
    schemaUI,
    primaryDisplay: view.primaryDisplay,
  }

  const result = await sdk.views.update(tableId, parsedView)
  ctx.body = {
    data: result,
  }
}

export async function remove(ctx: Ctx) {
  const { viewId } = ctx.params

  await sdk.views.remove(viewId)
  ctx.status = 204
}
