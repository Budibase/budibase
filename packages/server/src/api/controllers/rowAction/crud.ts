import {
  CreateRowActionRequest,
  Ctx,
  RowActionsResponse,
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

  const actions = await sdk.rowActions.get(table._id!)

  ctx.body = {
    tableId: table._id!,
    ...actions,
  }
}

export async function create(
  ctx: Ctx<CreateRowActionRequest, RowActionsResponse>
) {
  const table = await getTable(ctx)

  const created = await sdk.rowActions.create(table._id!, ctx.request.body)

  ctx.body = {
    tableId: table._id!,
    ...created,
  }
  ctx.status = 201
}

export function update() {
  throw new Error("Function not implemented.")
}

export function remove() {
  throw new Error("Function not implemented.")
}
