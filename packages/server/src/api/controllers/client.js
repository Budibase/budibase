const { create, destroy } = require("../../db/clientDb")
const env = require("../../environment")

exports.getClientId = async function(ctx) {
  ctx.body = env.CLIENT_ID
}

exports.create = async function(ctx) {
  const clientId = getClientId(ctx)
  await create(clientId)
  ctx.status = 200
  ctx.message = `Client Database ${clientId} successfully provisioned.`
}

exports.destroy = async function(ctx) {
  const clientId = getClientId(ctx)
  await destroy(clientId)
  ctx.status = 200
  ctx.message = `Client Database ${clientId} successfully deleted.`
}

const getClientId = ctx => {
  const clientId =
    (ctx.query && ctx.query.clientId) ||
    (ctx.body && ctx.body.clientId) ||
    env.CLIENT_ID
  if (!clientId) {
    ctx.throw(400, "ClientId not supplied")
  }
  return clientId
}
