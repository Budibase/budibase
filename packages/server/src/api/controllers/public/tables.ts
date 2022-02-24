import { search as stringSearch, addRev } from "./utils"
import { default as controller } from "../table"

export async function search(ctx: any) {
  const { name } = ctx.request.body
  await controller.fetch(ctx)
  ctx.body = {
    tables: stringSearch(ctx.body, name),
  }
}

export async function create(ctx: any) {
  await controller.save(ctx)
  ctx.body = { table: ctx.body }
}

export async function read(ctx: any) {
  await controller.find(ctx)
  ctx.body = { table: ctx.body }
}

export async function update(ctx: any) {
  ctx.request.body = await addRev(ctx.request.body, ctx.params.tableId)
  await controller.save(ctx)
  ctx.body = { table: ctx.body }
}

export async function destroy(ctx: any) {
  await controller.destroy(ctx)
  ctx.body = { table: ctx.table }
}

export default {
  create,
  read,
  update,
  destroy,
  search,
}
