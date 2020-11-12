const { BUILTIN_LEVELS } = require("../utilities/security/accessLevels")
const { PermissionTypes } = require("../utilities/security/permissions")
const env = require("../environment")
const { apiKeyTable } = require("../db/dynamoClient")
const { AuthTypes } = require("../constants")

const ADMIN_PERMS = [BUILTIN_LEVELS.admin._id, BUILTIN_LEVELS.builder._id]

const LOCAL_PASS = new RegExp(["webhooks/trigger", "webhooks/schema"].join("|"))

module.exports = (permType, permLevel = null) => async (ctx, next) => {
  // webhooks can pass locally
  if (!env.CLOUD && LOCAL_PASS.test(ctx.request.url)) {
    return next()
  }
  if (env.CLOUD && ctx.headers["x-api-key"] && ctx.headers["x-instanceid"]) {
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
        appId: ctx.headers["x-instanceid"],
      }
      return next()
    }

    ctx.throw(403, "API key invalid")
  }

  // don't expose builder endpoints in the cloud
  if (env.CLOUD && permType === PermissionTypes.BUILDER) return

  if (!ctx.auth.authenticated) {
    ctx.throw(403, "Session not authenticated")
  }

  if (!ctx.user) {
    ctx.throw(403, "User not found")
  }

  if (ADMIN_PERMS.indexOf(ctx.user.accessLevel._id) !== -1) {
    return next()
  }

  if (permType === PermissionTypes.BUILDER) {
    ctx.throw(403, "Not Authorized")
    return
  }

  // TODO: Replace the old permissions system here, check whether
  // user has permission to use endpoint they are trying to access
  return next()

  //ctx.throw(403, "Not Authorized")
}
