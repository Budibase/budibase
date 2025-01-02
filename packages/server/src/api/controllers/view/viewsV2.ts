import sdk from "../../../sdk"
import {
  CreateViewRequest,
  Ctx,
  RequiredKeys,
  UpdateViewRequest,
  ViewResponseEnriched,
  ViewV2,
  BasicViewFieldMetadata,
  ViewCalculationFieldMetadata,
  RelationSchemaField,
  ViewFieldMetadata,
  CalculationType,
  ViewFetchResponseEnriched,
  CountDistinctCalculationFieldMetadata,
  CountCalculationFieldMetadata,
  CreateViewResponse,
  UpdateViewResponse,
} from "@budibase/types"
import { events } from "@budibase/backend-core"
import { builderSocket, gridSocket } from "../../../websockets"
import { helpers } from "@budibase/shared-core"

function stripUnknownFields(
  field: ViewFieldMetadata
): RequiredKeys<ViewFieldMetadata> {
  if (helpers.views.isCalculationField(field)) {
    if (field.calculationType === CalculationType.COUNT) {
      if ("distinct" in field && field.distinct) {
        const strippedField: RequiredKeys<CountDistinctCalculationFieldMetadata> =
          {
            order: field.order,
            width: field.width,
            visible: field.visible,
            readonly: field.readonly,
            icon: field.icon,
            distinct: field.distinct,
            calculationType: field.calculationType,
            field: field.field,
            columns: field.columns,
          }
        return strippedField
      } else {
        const strippedField: RequiredKeys<CountCalculationFieldMetadata> = {
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
      }
    }
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

export async function fetch(ctx: Ctx<void, ViewFetchResponseEnriched>) {
  ctx.body = {
    data: await sdk.views.getAllEnriched(),
  }
}

export async function create(ctx: Ctx<CreateViewRequest, CreateViewResponse>) {
  const view = ctx.request.body
  const { tableId } = view

  const schema = await parseSchema(view)

  const parsedView: Omit<RequiredKeys<ViewV2>, "id" | "version"> = {
    name: view.name,
    type: view.type,
    tableId: view.tableId,
    query: view.query,
    queryUI: view.queryUI,
    sort: view.sort,
    schema,
    primaryDisplay: view.primaryDisplay,
    rowHeight: view.rowHeight,
  }
  const result = await sdk.views.create(tableId, parsedView)

  await events.view.created(result)

  ctx.status = 201
  ctx.body = {
    data: result,
  }

  const table = await sdk.tables.getTable(tableId)
  builderSocket?.emitTableUpdate(ctx, table)
  gridSocket?.emitViewUpdate(ctx, result)
}

async function handleViewFilterEvents(existingView: ViewV2, view: ViewV2) {
  const filterGroups = view.queryUI?.groups?.length || 0
  const properties = { filterGroups, tableId: view.tableId }
  if (
    filterGroups >= 2 &&
    filterGroups > (existingView?.queryUI?.groups?.length || 0)
  ) {
    await events.view.filterUpdated(properties)
  }
}

async function handleViewEvents(existingView: ViewV2, view: ViewV2) {
  // Grouped filters
  if (view.queryUI?.groups) {
    await handleViewFilterEvents(existingView, view)
  }

  // if new columns in the view
  for (const key in view.schema) {
    if ("calculationType" in view.schema[key] && !existingView?.schema?.[key]) {
      await events.view.calculationCreated({
        calculationType: view.schema[key].calculationType,
        tableId: view.tableId,
      })
    }

    // view joins
    for (const column in view.schema[key]?.columns ?? []) {
      // if the new column is visible and it wasn't before
      if (
        !existingView?.schema?.[key].columns?.[column].visible &&
        view.schema?.[key].columns?.[column].visible
      ) {
        // new view join exposing a column
        await events.view.viewJoinCreated({ tableId: view.tableId })
      }
    }
  }
}

export async function update(ctx: Ctx<UpdateViewRequest, UpdateViewResponse>) {
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
    type: view.type,
    version: view.version,
    tableId: view.tableId,
    query: view.query,
    queryUI: view.queryUI,
    sort: view.sort,
    schema,
    primaryDisplay: view.primaryDisplay,
    rowHeight: view.rowHeight,
  }

  const { view: result, existingView } = await sdk.views.update(
    tableId,
    parsedView
  )

  await handleViewEvents(existingView, result)
  await events.view.updated(result)

  ctx.body = { data: result }

  const table = await sdk.tables.getTable(tableId)
  builderSocket?.emitTableUpdate(ctx, table)
  gridSocket?.emitViewUpdate(ctx, result)
}

export async function remove(ctx: Ctx<void, void>) {
  const { viewId } = ctx.params

  const view = await sdk.views.remove(viewId)
  ctx.status = 204

  const table = await sdk.tables.getTable(view.tableId)
  builderSocket?.emitTableUpdate(ctx, table)
  gridSocket?.emitViewDeletion(ctx, view)
}
