const { create, destroy } = require("../../db/clientDb")
const env = require("../../environment")

exports.getClientId = async function(ctx) {
  ctx.body = env.CLIENT_ID
}

exports.create = async function(ctx) {
  await create(env.CLIENT_ID)
  ctx.status = 200
  ctx.message = `Client Database ${env.CLIENT_ID} successfully provisioned.`
}

exports.destroy = async function(ctx) {
  await destroy(env.CLIENT_ID)
  ctx.status = 200
  ctx.message = `Client Database ${env.CLIENT_ID} successfully deleted.`
}
