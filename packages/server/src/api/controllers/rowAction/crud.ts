import {
  CreateRowActionRequest,
  Ctx,
  RowActionPermissions,
  RowActionPermissionsResponse,
  RowActionResponse,
  RowActionsResponse,
} from "@budibase/types"
import { events } from "@budibase/backend-core"
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

  const rowActions = await sdk.rowActions.getAll(tableId)
  if (!rowActions) {
    ctx.body = {
      actions: {},
    }
    return
  }

  const { actions } = rowActions
  const automationNames = await sdk.rowActions.getNames(rowActions)
  const result: RowActionsResponse = {
    actions: Object.entries(actions).reduce<Record<string, RowActionResponse>>(
      (acc, [key, action]) => ({
        ...acc,
        [key]: {
          id: key,
          tableId,
          name: automationNames[action.automationId],
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

  await events.rowAction.created(createdAction)

  ctx.body = {
    tableId,
    id: createdAction.id,
    name: createdAction.name,
    automationId: createdAction.automationId,
    allowedSources: flattenAllowedSources(tableId, createdAction.permissions),
  }
  ctx.status = 201
}

export async function remove(ctx: Ctx<void, void>) {
  const table = await getTable(ctx)
  const { actionId } = ctx.params

  await sdk.rowActions.remove(table._id!, actionId)
  ctx.status = 204
}

export async function setTablePermission(
  ctx: Ctx<void, RowActionPermissionsResponse>
) {
  const table = await getTable(ctx)
  const tableId = table._id!
  const { actionId } = ctx.params

  const action = await sdk.rowActions.setTablePermission(tableId, actionId)
  ctx.body = {
    allowedSources: flattenAllowedSources(tableId, action.permissions),
  }
}

export async function unsetTablePermission(
  ctx: Ctx<void, RowActionPermissionsResponse>
) {
  const table = await getTable(ctx)
  const tableId = table._id!
  const { actionId } = ctx.params

  const action = await sdk.rowActions.unsetTablePermission(tableId, actionId)

  ctx.body = {
    allowedSources: flattenAllowedSources(tableId, action.permissions),
  }
}

export async function setViewPermission(
  ctx: Ctx<void, RowActionPermissionsResponse>
) {
  const table = await getTable(ctx)
  const tableId = table._id!
  const { actionId, viewId } = ctx.params

  const action = await sdk.rowActions.setViewPermission(
    tableId,
    actionId,
    viewId
  )
  ctx.body = {
    allowedSources: flattenAllowedSources(tableId, action.permissions),
  }
}

export async function unsetViewPermission(
  ctx: Ctx<void, RowActionPermissionsResponse>
) {
  const table = await getTable(ctx)
  const tableId = table._id!
  const { actionId, viewId } = ctx.params

  const action = await sdk.rowActions.unsetViewPermission(
    tableId,
    actionId,
    viewId
  )

  ctx.body = {
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
