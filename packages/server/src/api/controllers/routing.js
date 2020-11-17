const { getRoutingInfo } = require("../../utilities/routing")
const { AccessController } = require("../../utilities/security/accessLevels")

async function getRoutingStructure(appId) {
  let baseRouting = await getRoutingInfo(appId)
  return baseRouting
}

exports.fetch = async ctx => {
  ctx.body = await getRoutingStructure(ctx.appId)
}

exports.clientFetch = async ctx => {
  const routing = getRoutingStructure(ctx.appId)
  // use the access controller to pick which access level is applicable to this user
  const accessController = new AccessController(ctx.appId)
}
