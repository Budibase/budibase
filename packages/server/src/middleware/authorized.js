const {
  getUserRoleHierarchy,
  getRequiredResourceRole,
  BUILTIN_ROLE_IDS,
} = require("@budibase/auth/roles")
const {
  PermissionTypes,
  doesHaveBasePermission,
} = require("@budibase/auth/permissions")
const builderMiddleware = require("./builder")
const { isWebhookEndpoint } = require("./utils")

function hasResource(ctx) {
  return ctx.resourceId != null
}

module.exports =
  (permType, permLevel = null) =>
  async (ctx, next) => {
    // webhooks don't need authentication, each webhook unique
    if (isWebhookEndpoint(ctx)) {
      return next()
    }

    if (!ctx.user) {
      return ctx.throw(403, "No user info found")
    }

    // check general builder stuff, this middleware is a good way
    // to find API endpoints which are builder focused
    await builderMiddleware(ctx, permType)

    const isAuthed = ctx.isAuthenticated
    // builders for now have permission to do anything
    let isBuilder = ctx.user && ctx.user.builder && ctx.user.builder.global
    const isBuilderApi = permType === PermissionTypes.BUILDER
    if (isBuilder) {
      return next()
    } else if (isBuilderApi && !isBuilder) {
      return ctx.throw(403, "Not Authorized")
    }

    // need to check this first, in-case public access, don't check authed until last
    const roleId = ctx.roleId || BUILTIN_ROLE_IDS.PUBLIC
    const hierarchy = await getUserRoleHierarchy(ctx.appId, roleId, {
      idOnly: false,
    })
    const permError = "User does not have permission"
    let requiredRole
    if (hasResource(ctx)) {
      requiredRole = await getRequiredResourceRole(ctx.appId, permLevel, ctx)
    }
    // check if we found a role, if not fallback to base permissions
    if (requiredRole) {
      const found = hierarchy.find(role => role._id === requiredRole._id)
      return found ? next() : ctx.throw(403, permError)
    } else if (!doesHaveBasePermission(permType, permLevel, hierarchy)) {
      ctx.throw(403, permError)
    }

    // if they are not authed, then anything using the authorized middleware will fail
    if (!isAuthed) {
      ctx.throw(403, "Session not authenticated")
    }

    return next()
  }
