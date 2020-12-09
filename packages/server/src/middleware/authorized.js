const {
  BUILTIN_ROLE_IDS,
  getUserPermissionIds,
} = require("../utilities/security/roles")
const {
  PermissionTypes,
  doesHavePermission,
} = require("../utilities/security/permissions")
const env = require("../environment")
const { isAPIKeyValid } = require("../utilities/security/apikey")
const { AuthTypes } = require("../constants")

const ADMIN_ROLES = [BUILTIN_ROLE_IDS.ADMIN, BUILTIN_ROLE_IDS.BUILDER]

const LOCAL_PASS = new RegExp(["webhooks/trigger", "webhooks/schema"].join("|"))

module.exports = (permType, permLevel = null) => async (ctx, next) => {
  // webhooks can pass locally
  if (!env.CLOUD && LOCAL_PASS.test(ctx.request.url)) {
    return next()
  }
  if (env.CLOUD && ctx.headers["x-api-key"] && ctx.headers["x-instanceid"]) {
    // api key header passed by external webhook
    if (await isAPIKeyValid(ctx.headers["x-api-key"])) {
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

  const role = ctx.user.role
  const permissions = await getUserPermissionIds(ctx.appId, role._id)
  if (ADMIN_ROLES.indexOf(role._id) !== -1) {
    return next()
  }

  if (permType === PermissionTypes.BUILDER) {
    ctx.throw(403, "Not Authorized")
  }

  if (!doesHavePermission(permType, permLevel, permissions)) {
    ctx.throw(403, "User does not have permission")
  }

  return next()
}
