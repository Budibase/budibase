const {
  adminPermissions,
  ADMIN_LEVEL_ID,
  POWERUSER_LEVEL_ID,
  BUILDER_LEVEL_ID,
  BUILDER,
} = require("../utilities/accessLevels")

module.exports = (permName, getItemId) => async (ctx, next) => {
  if (!ctx.isAuthenticated) {
    ctx.throw(403, "Session not authenticated")
  }

  if (!ctx.user) {
    ctx.throw(403, "User not found")
  }

  if (ctx.user.accessLevel._id === BUILDER_LEVEL_ID) {
    return next()
  }

  if (permName === BUILDER) {
    ctx.throw(403, "Not Authorized")
    return
  }

  const permissionId = ({ name, itemId }) => name + (itemId ? `-${itemId}` : "")

  if (ctx.user.accessLevel._id === ADMIN_LEVEL_ID) {
    return next()
  }

  const thisPermissionId = permissionId({
    name: permName,
    itemId: getItemId && getItemId(ctx),
  })

  // power user has everything, except the admin specific perms
  if (
    ctx.user.accessLevel._id === POWERUSER_LEVEL_ID &&
    !adminPermissions.map(permissionId).includes(thisPermissionId)
  ) {
    return next()
  }

  if (
    ctx.user.accessLevel.permissions
      .map(permissionId)
      .includes(thisPermissionId)
  ) {
    return next()
  }

  ctx.throw(403, "Not Authorized")
}
