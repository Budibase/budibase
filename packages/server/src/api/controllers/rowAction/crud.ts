import { CreateRowActionRequest, Ctx, RowAction } from "@budibase/types"
import sdk from "../../../sdk"

export function find() {
  throw new Error("Function not implemented.")
}

export async function create(ctx: Ctx<CreateRowActionRequest, RowAction>) {
  const { tableId } = ctx.params

  const table = await sdk.tables.getTable(tableId)
  if (!table) {
    ctx.throw(404)
  }

  // TODO

  ctx.status = 201
}

export function update() {
  throw new Error("Function not implemented.")
}

export function remove() {
  throw new Error("Function not implemented.")
}
