const { getUserPermissions } = require("@budibase/auth/roles")
const {
  PermissionTypes,
  doesHaveResourcePermission,
  doesHaveBasePermission,
} = require("@budibase/auth/permissions")
const { APP_DEV_PREFIX } = require("../db/utils")
const { doesUserHaveLock, updateLock } = require("../utilities/redis")

function hasResource(ctx) {
  return ctx.resourceId != null
}

const WEBHOOK_ENDPOINTS = new RegExp(
  ["webhooks/trigger", "webhooks/schema"].join("|")
)

async function checkDevAppLocks(ctx) {
  const appId = ctx.appId

  // not a development app, don't need to do anything
  if (!appId || !appId.startsWith(APP_DEV_PREFIX)) {
    return
  }
  if (!(await doesUserHaveLock(appId, ctx.user))) {
    ctx.throw(403, "User does not hold app lock.")
  }

  // they do have lock, update it
  await updateLock(appId, ctx.user)
}

module.exports = (permType, permLevel = null) => async (ctx, next) => {
  // webhooks don't need authentication, each webhook unique
  if (WEBHOOK_ENDPOINTS.test(ctx.request.url)) {
    return next()
  }

  if (!ctx.user) {
    return ctx.throw(403, "No user info found")
  }

  const builderCall = permType === PermissionTypes.BUILDER
  const referer = ctx.headers["referer"]
  const editingApp = referer ? referer.includes(ctx.appId) : false
  // this makes sure that builder calls abide by dev locks
  if (builderCall && editingApp) {
    await checkDevAppLocks(ctx)
  }

  const isAuthed = ctx.isAuthenticated
  const { basePermissions, permissions } = await getUserPermissions(
    ctx.appId,
    ctx.roleId
  )

  // builders for now have permission to do anything
  // TODO: in future should consider separating permissions with an require("@budibase/auth").isClient check
  let isBuilder = ctx.user && ctx.user.builder && ctx.user.builder.global
  if (isBuilder) {
    return next()
  } else if (builderCall && !isBuilder) {
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
