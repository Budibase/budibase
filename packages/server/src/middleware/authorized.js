const {
  adminPermissions,
  ADMIN_LEVEL_ID,
  POWERUSER_LEVEL_ID,
  BUILDER_LEVEL_ID,
  BUILDER,
} = require("../utilities/accessLevels")
const environment = require("../environment")
const { apiKeyTable } = require("../db/dynamoClient")
const { AuthTypes } = require("../constants")

const LOCAL_PASS = new RegExp(["webhooks/trigger", "webhooks/schema"].join("|"))

module.exports = (permName, getItemId) => async (ctx, next) => {
  // webhooks can pass locally
  if (!environment.CLOUD && LOCAL_PASS.test(ctx.request.url)) {
    return next()
  }
  if (
    environment.CLOUD &&
    ctx.headers["x-api-key"] &&
    ctx.headers["x-instanceid"]
  ) {
    // api key header passed by external webhook
    const apiKeyInfo = await apiKeyTable.get({
      primary: ctx.headers["x-api-key"],
    })

    if (apiKeyInfo) {
      ctx.auth = {
        authenticated: AuthTypes.EXTERNAL,
        apiKey: ctx.headers["x-api-key"],
      }
      ctx.user = {
        instanceId: ctx.headers["x-instanceid"],
      }
      return next()
    }

    ctx.throw(403, "API key invalid")
  }

  // don't expose builder endpoints in the cloud
  if (environment.CLOUD && permName === BUILDER) return

  if (!ctx.auth.authenticated) {
    ctx.throw(403, "Session not authenticated")
  }

  if (!ctx.user) {
    ctx.throw(403, "User not found")
  }

  if (ctx.user.accessLevel._id === ADMIN_LEVEL_ID) {
    return next()
  }

  if (ctx.user.accessLevel._id === BUILDER_LEVEL_ID) {
    return next()
  }

  if (permName === BUILDER) {
    ctx.throw(403, "Not Authorized")
    return
  }

  const permissionId = ({ name, itemId }) => name + (itemId ? `-${itemId}` : "")

  const thisPermissionId = permissionId({
    name: permName,
    itemId: getItemId && getItemId(ctx),
  })

  // power user has everything, except the admin specific perms
  if (
    ctx.user.accessLevel._id === POWERUSER_LEVEL_ID &&
    !adminPermissions.map(permissionId).includes(thisPermissionId)
  ) {
    return next()
  }

  if (
    ctx.user.accessLevel.permissions
      .map(permissionId)
      .includes(thisPermissionId)
  ) {
    return next()
  }

  ctx.throw(403, "Not Authorized")
}
