const { BUILTIN_PERMISSIONS } = require("../../utilities/security/permissions")

exports.fetch = async function(ctx) {
  // TODO: need to build out custom permissions
  ctx.body = Object.values(BUILTIN_PERMISSIONS)
}
