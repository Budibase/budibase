const {
  BUILTIN_ROLE_IDS,
  getUserPermissions,
} = require("../utilities/security/roles")
const {
  PermissionTypes,
  doesHaveResourcePermission,
  doesHaveBasePermission,
} = require("../utilities/security/permissions")
const env = require("../environment")
const { isAPIKeyValid } = require("../utilities/security/apikey")
const { AuthTypes } = require("../constants")

const ADMIN_ROLES = [BUILTIN_ROLE_IDS.ADMIN, BUILTIN_ROLE_IDS.BUILDER]

function hasResource(ctx) {
  return ctx.resourceId != null
}

module.exports = (permType, permLevel = null) => async (ctx, next) => {
  if (env.isProd() && ctx.headers["x-api-key"] && ctx.headers["x-instanceid"]) {
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

    return ctx.throw(403, "API key invalid")
  }

  if (!ctx.user) {
    return ctx.throw(403, "No user info found")
  }

  const role = ctx.user.role
  const isBuilder = role._id === BUILTIN_ROLE_IDS.BUILDER
  const isAdmin = ADMIN_ROLES.includes(role._id)
  const isAuthed = ctx.auth.authenticated

  if (permType === PermissionTypes.BUILDER && isBuilder) {
    return next()
  }

  const { basePermissions, permissions } = await getUserPermissions(
    ctx.appId,
    role._id
  )

  // this may need to change in the future, right now only admins
  // can have access to builder features, this is hard coded into
  // our rules
  if (isAdmin && isAuthed) {
    return next()
  } else if (permType === PermissionTypes.BUILDER) {
    return ctx.throw(403, "Not Authorized")
  }

  if (
    hasResource(ctx) &&
    doesHaveResourcePermission(permissions, permLevel, ctx)
  ) {
    return next()
  }

  if (!isAuthed) {
    ctx.throw(403, "Session not authenticated")
  }

  if (!doesHaveBasePermission(permType, permLevel, basePermissions)) {
    ctx.throw(403, "User does not have permission")
  }

  return next()
}
