const { getUserPermissions } = require("../utilities/security/roles")
const {
  PermissionTypes,
  doesHaveResourcePermission,
  doesHaveBasePermission,
} = require("../utilities/security/permissions")

function hasResource(ctx) {
  return ctx.resourceId != null
}

const WEBHOOK_ENDPOINTS = new RegExp(
  ["webhooks/trigger", "webhooks/schema"].join("|")
)

module.exports = (permType, permLevel = null) => async (ctx, next) => {
  // webhooks don't need authentication, each webhook unique
  if (WEBHOOK_ENDPOINTS.test(ctx.request.url)) {
    return next()
  }

  if (!ctx.user) {
    return ctx.throw(403, "No user info found")
  }

  const isAuthed = ctx.isAuthenticated

  const { basePermissions, permissions } = await getUserPermissions(
    ctx.appId,
    ctx.roleId
  )

  // TODO: need to determine if the user has permission to build here, global cookie

  // this may need to change in the future, right now only admins
  // can have access to builder features, this is hard coded into
  // our rules
  if (isAuthed) {
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
