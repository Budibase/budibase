// Permissions
module.exports.READ_MODEL = "read-model"
module.exports.WRITE_MODEL = "write-model"
module.exports.READ_VIEW = "read-view"
module.exports.EXECUTE_WORKFLOW = "execute-workflow"
module.exports.USER_MANAGEMENT = "user-management"
module.exports.BUILDER = "builder"
module.exports.LIST_USERS = "list-users"
// Access Level IDs
module.exports.ADMIN_LEVEL_ID = "ADMIN"
module.exports.POWERUSER_LEVEL_ID = "POWER_USER"
module.exports.BUILDER_LEVEL_ID = "BUILDER"
module.exports.ANON_LEVEL_ID = "ANON"
module.exports.ACCESS_LEVELS = [
  module.exports.ADMIN_LEVEL_ID,
  module.exports.POWERUSER_LEVEL_ID,
  module.exports.BUILDER_LEVEL_ID,
  module.exports.ANON_LEVEL_ID,
]
module.exports.PRETTY_ACCESS_LEVELS = {
  [module.exports.ADMIN_LEVEL_ID]: "Admin",
  [module.exports.POWERUSER_LEVEL_ID]: "Power user",
  [module.exports.BUILDER_LEVEL_ID]: "Builder",
  [module.exports.ANON_LEVEL_ID]: "Anonymous",
}
module.exports.adminPermissions = [
  {
    name: module.exports.USER_MANAGEMENT,
  },
]

// to avoid circular dependencies this is included later, after exporting all enums
const permissions = require("./permissions")
module.exports.generateAdminPermissions = permissions.generateAdminPermissions
module.exports.generatePowerUserPermissions =
  permissions.generatePowerUserPermissions
