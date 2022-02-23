const { search, addRev } = require("./utils")
const controller = require("../table")

exports.search = async ctx => {
  const { name } = ctx.request.body
  await controller.fetch(ctx)
  ctx.body = {
    tables: search(ctx.body, name),
  }
}

exports.create = async ctx => {
  await controller.save(ctx)
  ctx.body = { table: ctx.body }
}

exports.read = async ctx => {
  await controller.find(ctx)
  ctx.body = { table: ctx.body }
}

exports.update = async ctx => {
  ctx.request.body = await addRev(ctx.request.body, ctx.params.tableId)
  await controller.save(ctx)
  ctx.body = { table: ctx.body }
}

exports.delete = async ctx => {
  await controller.destroy(ctx)
  ctx.body = { table: ctx.table }
}
