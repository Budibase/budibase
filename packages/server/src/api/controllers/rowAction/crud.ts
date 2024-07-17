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

  const { actions } = await sdk.rowActions.get(table._id!)
  const result: RowActionsResponse = {
    actions: Object.entries(actions).reduce<Record<string, RowActionResponse>>(
      (acc, [key, action]) => ({
        ...acc,
        [key]: { id: key, tableId: table._id!, ...action },
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
    ...createdAction,
  }
  ctx.status = 201
}

export async function update(
  ctx: Ctx<UpdateRowActionRequest, RowActionResponse>
) {
  const table = await getTable(ctx)
  const { actionId } = ctx.params

  const actions = await sdk.rowActions.update(table._id!, actionId, {
    name: ctx.request.body.name,
  })

  ctx.body = {
    tableId: table._id!,
    ...actions,
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const table = await getTable(ctx)
  const { actionId } = ctx.params

  await sdk.rowActions.remove(table._id!, actionId)
  ctx.status = 204
}
