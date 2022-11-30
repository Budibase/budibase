import { search as stringSearch, addRev } from "./utils"
import * as controller from "../table"
import { Table } from "@budibase/types"

function fixTable(table: Table, params: any) {
  if (!params || !table) {
    return table
  }
  if (params.tableId) {
    table._id = params.tableId
  }
  if (!table.type) {
    table.type = "table"
  }
  return table
}

export async function search(ctx: any, next: any) {
  const { name } = ctx.request.body
  await controller.fetch(ctx)
  ctx.body = stringSearch(ctx.body, name)
  await next()
}

export async function create(ctx: any, next: any) {
  await controller.save(ctx)
  await next()
}

export async function read(ctx: any, next: any) {
  await controller.find(ctx)
  await next()
}

export async function update(ctx: any, next: any) {
  ctx.request.body = await addRev(
    fixTable(ctx.request.body, ctx.params),
    ctx.params.tableId
  )
  await controller.save(ctx)
  await next()
}

export async function destroy(ctx: any, next: any) {
  await controller.destroy(ctx)
  ctx.body = ctx.table
  await next()
}

export default {
  create,
  read,
  update,
  destroy,
  search,
}
