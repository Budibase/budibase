const { getDefinitions } = require("../../integrations")

exports.fetch = async function (ctx) {
  ctx.status = 200
  const defs = await getDefinitions()

  ctx.body = defs
}

exports.find = async function (ctx) {
  const defs = await getDefinitions()
  ctx.status = 200
  ctx.body = defs[ctx.params.type]
}
