import {
  CreateRowActionRequest,
  Ctx,
  RowAction,
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

  // TODO

  ctx.body = { actions: [] }
}

export async function create(ctx: Ctx<CreateRowActionRequest, RowAction>) {
  const table = await getTable(ctx)

  // TODO

  ctx.status = 201
}

export function update() {
  throw new Error("Function not implemented.")
}

export function remove() {
  throw new Error("Function not implemented.")
}
