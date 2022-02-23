const { searchDocs } = require("./utils")
const { DocumentTypes } = require("../../../db/utils")
const queryController = require("../query")

exports.search = async ctx => {
  const { name } = ctx.request.body
  ctx.body = {
    queries: await searchDocs(DocumentTypes.QUERY, "name", name),
  }
}

exports.execute = async ctx => {
  await queryController.executeV2(ctx)
}
