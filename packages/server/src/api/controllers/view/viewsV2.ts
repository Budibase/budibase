import sdk from "../../../sdk"
import {
  CreateViewRequest,
  Ctx,
  RequiredKeys,
  UpdateViewRequest,
  ViewResponse,
  ViewResponseEnriched,
  ViewV2,
  BasicViewFieldMetadata,
  ViewCalculationFieldMetadata,
  RelationSchemaField,
  ViewFieldMetadata,
} from "@budibase/types"
import { builderSocket, gridSocket } from "../../../websockets"
import { helpers } from "@budibase/shared-core"

function stripUnknownFields(
  field: BasicViewFieldMetadata
): RequiredKeys<BasicViewFieldMetadata> {
  if (helpers.views.isCalculationField(field)) {
    const strippedField: RequiredKeys<ViewCalculationFieldMetadata> = {
      order: field.order,
      width: field.width,
      visible: field.visible,
      readonly: field.readonly,
      icon: field.icon,
      calculationType: field.calculationType,
      field: field.field,
      columns: field.columns,
    }
    return strippedField
  } else {
    const strippedField: RequiredKeys<BasicViewFieldMetadata> = {
      order: field.order,
      width: field.width,
      visible: field.visible,
      readonly: field.readonly,
      icon: field.icon,
      columns: field.columns,
    }
    return strippedField
  }
}

function stripUndefinedFields(obj: Record<string, any>): void {
  Object.keys(obj)
    .filter(key => obj[key] === undefined)
    .forEach(key => {
      delete obj[key]
    })
}

async function parseSchema(view: CreateViewRequest) {
  if (!view.schema) {
    return
  }
  const finalViewSchema =
    view.schema &&
    Object.entries(view.schema).reduce((p, [fieldName, schemaValue]) => {
      let fieldRelatedSchema:
        | Record<string, RequiredKeys<RelationSchemaField>>
        | undefined

      if (schemaValue.columns) {
        fieldRelatedSchema = Object.entries(schemaValue.columns).reduce<
          NonNullable<typeof fieldRelatedSchema>
        >((acc, [key, fieldSchema]) => {
          acc[key] = {
            visible: fieldSchema.visible,
            readonly: fieldSchema.readonly,
            order: fieldSchema.order,
            width: fieldSchema.width,
            icon: fieldSchema.icon,
          }
          return acc
        }, {})
        schemaValue.columns = fieldRelatedSchema
      }

      const fieldSchema = stripUnknownFields(schemaValue)
      stripUndefinedFields(fieldSchema)

      p[fieldName] = fieldSchema
      return p
    }, {} as Record<string, RequiredKeys<ViewFieldMetadata>>)
  return finalViewSchema
}

export async function get(ctx: Ctx<void, ViewResponseEnriched>) {
  ctx.body = {
    data: await sdk.views.getEnriched(ctx.params.viewId),
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
    queryUI: view.queryUI,
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
    queryUI: view.queryUI,
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
