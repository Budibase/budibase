import {
  CreateRowActionRequest,
  Ctx,
  RowActionResponse,
  RowActionsResponse,
  UpdateRowActionRequest,
} from "@budibase/types"
import sdk from "../../../sdk"

async function getTable(ctx: Ctx) {
  const { tableId } = ctx.params
  const table = await sdk.tables.getTable(tableId)
  if (!table) {
    ctx.throw(404)
  }
  return table
}

export async function find(ctx: Ctx<void, RowActionsResponse>) {
  const table = await getTable(ctx)

  if (!(await sdk.rowActions.docExists(table._id!))) {
    ctx.body = {
      actions: {},
    }
    return
  }

  const { actions } = await sdk.rowActions.getAll(table._id!)
  const result: RowActionsResponse = {
    actions: Object.entries(actions).reduce<Record<string, RowActionResponse>>(
      (acc, [key, action]) => ({
        ...acc,
        [key]: {
          id: key,
          tableId: table._id!,
          name: action.name,
          automationId: action.automationId,
          allowedViews: flattenAllowedViews(action.permissions.views),
        },
      }),
      {}
    ),
  }
  ctx.body = result
}

export async function create(
  ctx: Ctx<CreateRowActionRequest, RowActionResponse>
) {
  const table = await getTable(ctx)

  const createdAction = await sdk.rowActions.create(table._id!, {
    name: ctx.request.body.name,
  })

  ctx.body = {
    tableId: table._id!,
    id: createdAction.id,
    name: createdAction.name,
    automationId: createdAction.automationId,
    allowedViews: undefined,
  }
  ctx.status = 201
}

export async function update(
  ctx: Ctx<UpdateRowActionRequest, RowActionResponse>
) {
  const table = await getTable(ctx)
  const { actionId } = ctx.params

  const action = await sdk.rowActions.update(table._id!, actionId, {
    name: ctx.request.body.name,
  })

  ctx.body = {
    tableId: table._id!,
    id: action.id,
    name: action.name,
    automationId: action.automationId,
    allowedViews: undefined,
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const table = await getTable(ctx)
  const { actionId } = ctx.params

  await sdk.rowActions.remove(table._id!, actionId)
  ctx.status = 204
}

export async function setViewPermission(ctx: Ctx<void, RowActionResponse>) {
  const table = await getTable(ctx)
  const { actionId, viewId } = ctx.params

  const action = await sdk.rowActions.setViewPermission(
    table._id!,
    actionId,
    viewId
  )
  ctx.body = {
    tableId: table._id!,
    id: action.id,
    name: action.name,
    automationId: action.automationId,
    allowedViews: flattenAllowedViews(action.permissions.views),
  }
}

export async function unsetViewPermission(ctx: Ctx<void, RowActionResponse>) {
  const table = await getTable(ctx)
  const { actionId, viewId } = ctx.params

  const action = await sdk.rowActions.unsetViewPermission(
    table._id!,
    actionId,
    viewId
  )

  ctx.body = {
    tableId: table._id!,
    id: action.id,
    name: action.name,
    automationId: action.automationId,
    allowedViews: flattenAllowedViews(action.permissions.views),
  }
}

function flattenAllowedViews(
  permissions: Record<string, { runAllowed: boolean }>
) {
  const allowedPermissions = Object.entries(permissions || {})
    .filter(([_, p]) => p.runAllowed)
    .map(([viewId]) => viewId)
  if (!allowedPermissions.length) {
    return undefined
  }

  return allowedPermissions
}
