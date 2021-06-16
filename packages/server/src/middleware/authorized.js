const { getUserPermissions } = require("@budibase/auth/roles")
const {
  PermissionTypes,
  doesHaveResourcePermission,
  doesHaveBasePermission,
} = require("@budibase/auth/permissions")
const builderMiddleware = require("./builder")

function hasResource(ctx) {
  return ctx.resourceId != null
}

const WEBHOOK_ENDPOINTS = new RegExp(
  ["webhooks/trigger", "webhooks/schema"].join("|")
)

module.exports =
  (permType, permLevel = null) =>
  async (ctx, next) => {
    // webhooks don't need authentication, each webhook unique
    if (WEBHOOK_ENDPOINTS.test(ctx.request.url)) {
      return next()
    }

    if (!ctx.user) {
      return ctx.throw(403, "No user info found")
    }

    // check general builder stuff, this middleware is a good way
    // to find API endpoints which are builder focused
    await builderMiddleware(ctx, permType)

    const isAuthed = ctx.isAuthenticated
    const { basePermissions, permissions } = await getUserPermissions(
      ctx.appId,
      ctx.roleId
    )

    // builders for now have permission to do anything
    // TODO: in future should consider separating permissions with an require("@budibase/auth").isClient check
    let isBuilder = ctx.user && ctx.user.builder && ctx.user.builder.global
    const isBuilderApi = permType === PermissionTypes.BUILDER
    if (isBuilder) {
      return next()
    } else if (isBuilderApi && !isBuilder) {
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
