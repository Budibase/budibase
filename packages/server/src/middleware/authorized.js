const {
  adminPermissions,
  ADMIN_LEVEL_ID,
  POWERUSER_LEVEL_ID,
  BUILDER,
} = require("../utilities/accessLevels")

module.exports = (permName, getItemId) => async (ctx, next) => {
  if (!ctx.isAuthenticated) {
    ctx.throw(403, "Session not authenticated")
  }

  if (ctx.isBuilder) {
    await next()
    return
  }

  if (permName === BUILDER) {
    ctx.throw(403, "Not Authorized")
    return
  }

  if (!ctx.user) {
    ctx.throw(403, "User not found")
  }

  const permissionId = ({ name, itemId }) => name + (itemId ? `-${itemId}` : "")

  if (ctx.user.accessLevel._id === ADMIN_LEVEL_ID) {
    await next()
    return
  }

  const thisPermissionId = {
    name: permName,
    itemId: getItemId && getItemId(ctx),
  }

  // power user has everything, except the admin specific perms
  if (
    ctx.user.accessLevel._id === POWERUSER_LEVEL_ID &&
    !adminPermissions.map(permissionId).includes(thisPermissionId)
  ) {
    await next()
    return
  }

  if (
    ctx.user.accessLevel.permissions
      .map(permissionId)
      .includes(thisPermissionId)
  ) {
    await next()
    return
  }

  ctx.throw(403, "Not Authorized")
}
