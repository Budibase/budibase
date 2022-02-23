const { search } = require("./utils")
const queryController = require("../query")

exports.search = async ctx => {
  await queryController.fetch(ctx)
  const { name } = ctx.request.body
  ctx.body = {
    queries: search(ctx.body, name),
  }
}

exports.execute = async ctx => {
  await queryController.executeV2(ctx)
}
