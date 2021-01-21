const { definitions } = require("../../integrations")

exports.fetch = async function(ctx) {
  // TODO: fetch these from a github repo etc
  console.log(definitions)
  ctx.status = 200
  ctx.body = definitions
}

exports.find = async function(ctx) {
  ctx.status = 200
  ctx.body = definitions[ctx.params.type]
}
