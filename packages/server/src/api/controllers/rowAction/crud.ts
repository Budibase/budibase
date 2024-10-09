import {
  CreateRowActionRequest,
  Ctx,
  RowActionPermissions,
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
  const tableId = table._id!

  if (!(await sdk.rowActions.docExists(tableId))) {
    ctx.body = {
      actions: {},
    }
    return
  }

  const { actions } = await sdk.rowActions.getAll(tableId)
  const result: RowActionsResponse = {
    actions: Object.entries(actions).reduce<Record<string, RowActionResponse>>(
      (acc, [key, action]) => ({
        ...acc,
        [key]: {
          id: key,
          tableId,
          name: action.name,
          automationId: action.automationId,
          allowedSources: flattenAllowedSources(tableId, action.permissions),
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
  const tableId = table._id!

  const createdAction = await sdk.rowActions.create(tableId, {
    name: ctx.request.body.name,
  })

  ctx.body = {
    tableId,
    id: createdAction.id,
    name: createdAction.name,
    automationId: createdAction.automationId,
    allowedSources: flattenAllowedSources(tableId, createdAction.permissions),
  }
  ctx.status = 201
}

export async function update(
  ctx: Ctx<UpdateRowActionRequest, RowActionResponse>
) {
  const table = await getTable(ctx)
  const tableId = table._id!
  const { actionId } = ctx.params

  const action = await sdk.rowActions.update(tableId, actionId, {
    name: ctx.request.body.name,
  })

  ctx.body = {
    tableId,
    id: action.id,
    name: action.name,
    automationId: action.automationId,
    allowedSources: flattenAllowedSources(tableId, action.permissions),
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const table = await getTable(ctx)
  const { actionId } = ctx.params

  await sdk.rowActions.remove(table._id!, actionId)
  ctx.status = 204
}

export async function setTablePermission(ctx: Ctx<void, RowActionResponse>) {
  const table = await getTable(ctx)
  const tableId = table._id!
  const { actionId } = ctx.params

  const action = await sdk.rowActions.setTablePermission(tableId, actionId)
  ctx.body = {
    tableId,
    id: action.id,
    name: action.name,
    automationId: action.automationId,
    allowedSources: flattenAllowedSources(tableId, action.permissions),
  }
}

export async function unsetTablePermission(ctx: Ctx<void, RowActionResponse>) {
  const table = await getTable(ctx)
  const tableId = table._id!
  const { actionId } = ctx.params

  const action = await sdk.rowActions.unsetTablePermission(tableId, actionId)

  ctx.body = {
    tableId,
    id: action.id,
    name: action.name,
    automationId: action.automationId,
    allowedSources: flattenAllowedSources(tableId, action.permissions),
  }
}

export async function setViewPermission(ctx: Ctx<void, RowActionResponse>) {
  const table = await getTable(ctx)
  const tableId = table._id!
  const { actionId, viewId } = ctx.params

  const action = await sdk.rowActions.setViewPermission(
    tableId,
    actionId,
    viewId
  )
  ctx.body = {
    tableId,
    id: action.id,
    name: action.name,
    automationId: action.automationId,
    allowedSources: flattenAllowedSources(tableId, action.permissions),
  }
}

export async function unsetViewPermission(ctx: Ctx<void, RowActionResponse>) {
  const table = await getTable(ctx)
  const tableId = table._id!
  const { actionId, viewId } = ctx.params

  const action = await sdk.rowActions.unsetViewPermission(
    tableId,
    actionId,
    viewId
  )

  ctx.body = {
    tableId,
    id: action.id,
    name: action.name,
    automationId: action.automationId,
    allowedSources: flattenAllowedSources(tableId, action.permissions),
  }
}

function flattenAllowedSources(
  tableId: string,
  permissions: RowActionPermissions
) {
  const allowedPermissions = []
  if (permissions.table.runAllowed) {
    allowedPermissions.push(tableId)
  }
  allowedPermissions.push(
    ...Object.keys(permissions.views || {}).filter(
      viewId => permissions.views[viewId].runAllowed
    )
  )

  return allowedPermissions
}
