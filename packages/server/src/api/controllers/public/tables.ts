import { search as stringSearch, addRev, wrapResponse } from "./utils"
import { default as controller } from "../table"
import { Table } from "../../../definitions/common"

function fixTable(table: Table, params: any) {
  if (!params || !table) {
    return table
  }
  if (params.tableId) {
    table._id = params.tableId
  }
  return table
}

export async function search(ctx: any) {
  const { name } = ctx.request.body
  await controller.fetch(ctx)
  ctx.body = stringSearch(ctx.body, name)
  wrapResponse(ctx)
}

export async function create(ctx: any) {
  await controller.save(ctx)
  wrapResponse(ctx)
}

export async function read(ctx: any) {
  await controller.find(ctx)
  wrapResponse(ctx)
}

export async function update(ctx: any) {
  ctx.request.body = await addRev(
    fixTable(ctx.request.body, ctx.params),
    ctx.params.tableId
  )
  await controller.save(ctx)
  wrapResponse(ctx)
}

export async function destroy(ctx: any) {
  await controller.destroy(ctx)
  ctx.body = ctx.table
  wrapResponse(ctx)
}

export default {
  create,
  read,
  update,
  destroy,
  search,
}
