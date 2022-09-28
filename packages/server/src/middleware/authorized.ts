import {
  getUserRoleHierarchy,
  getRequiredResourceRole,
  BUILTIN_ROLE_IDS,
} from "@budibase/backend-core/roles"
const {
  PermissionTypes,
  PermissionLevels,
  doesHaveBasePermission,
} = require("@budibase/backend-core/permissions")
const builderMiddleware = require("./builder")
const { isWebhookEndpoint } = require("./utils")
const { buildCsrfMiddleware } = require("@budibase/backend-core/auth")
const { getAppId } = require("@budibase/backend-core/context")

function hasResource(ctx: any) {
  return ctx.resourceId != null
}

const csrf = buildCsrfMiddleware()

/**
 * Apply authorization to the requested resource:
 * - If this is a builder resource the user must be a builder.
 * - Builders can access all resources.
 * - Otherwise the user must have the required role.
 */
const checkAuthorized = async (
  ctx: any,
  resourceRoles: any,
  permType: any,
  permLevel: any
) => {
  // check if this is a builder api and the user is not a builder
  const isBuilder = ctx.user && ctx.user.builder && ctx.user.builder.global
  const isBuilderApi = permType === PermissionTypes.BUILDER
  if (isBuilderApi && !isBuilder) {
    return ctx.throw(403, "Not Authorized")
  }

  // check for resource authorization
  if (!isBuilder) {
    await checkAuthorizedResource(ctx, resourceRoles, permType, permLevel)
  }
}

const checkAuthorizedResource = async (
  ctx: any,
  resourceRoles: any,
  permType: any,
  permLevel: any
) => {
  // get the user's roles
  const roleId = ctx.roleId || BUILTIN_ROLE_IDS.PUBLIC
  const userRoles = (await getUserRoleHierarchy(roleId, {
    idOnly: false,
  })) as { _id: string }[]
  const permError = "User does not have permission"
  // check if the user has the required role
  if (resourceRoles.length > 0) {
    // deny access if the user doesn't have the required resource role
    const found = userRoles.find(
      (role: any) => resourceRoles.indexOf(role._id) !== -1
    )
    if (!found) {
      ctx.throw(403, permError)
    }
    // fallback to the base permissions when no resource roles are found
  } else if (!doesHaveBasePermission(permType, permLevel, userRoles)) {
    ctx.throw(403, permError)
  }
}

export = (permType: any, permLevel: any = null, opts = { schema: false }) =>
  async (ctx: any, next: any) => {
    // webhooks don't need authentication, each webhook unique
    // also internal requests (between services) don't need authorized
    if (isWebhookEndpoint(ctx) || ctx.internal) {
      return next()
    }

    if (!ctx.user) {
      return ctx.throw(403, "No user info found")
    }

    // check general builder stuff, this middleware is a good way
    // to find API endpoints which are builder focused
    await builderMiddleware(ctx, permType)

    // get the resource roles
    let resourceRoles: any = []
    let otherLevelRoles: any = []
    const otherLevel =
      permLevel === PermissionLevels.READ
        ? PermissionLevels.WRITE
        : PermissionLevels.READ
    const appId = getAppId()
    if (appId && hasResource(ctx)) {
      resourceRoles = await getRequiredResourceRole(permLevel, ctx)
      if (opts && opts.schema) {
        otherLevelRoles = await getRequiredResourceRole(otherLevel, ctx)
      }
    }

    // if the resource is public, proceed
    if (
      resourceRoles.includes(BUILTIN_ROLE_IDS.PUBLIC) ||
      (otherLevelRoles && otherLevelRoles.includes(BUILTIN_ROLE_IDS.PUBLIC))
    ) {
      return next()
    }

    // check authenticated
    if (!ctx.isAuthenticated) {
      return ctx.throw(403, "Session not authenticated")
    }

    try {
      // check authorized
      await checkAuthorized(ctx, resourceRoles, permType, permLevel)
    } catch (err) {
      // this is a schema, check if
      if (opts && opts.schema && permLevel) {
        await checkAuthorized(ctx, otherLevelRoles, permType, otherLevel)
      } else {
        throw err
      }
    }

    // csrf protection
    return csrf(ctx, next)
  }
