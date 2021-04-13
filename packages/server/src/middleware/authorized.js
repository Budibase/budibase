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

  let isBuilder = ctx.user && ctx.user.builder && ctx.user.builder.global
  if (permType === PermissionTypes.BUILDER && isBuilder) {
    return next()
  } else if (permType === PermissionTypes.BUILDER && !isBuilder) {
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
