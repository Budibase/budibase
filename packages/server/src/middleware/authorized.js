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
  return next()
}
