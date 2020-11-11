const { DocumentTypes, SEPARATOR } = require("../../db/utils")

function makeAccessLevelId(baseId) {
  return `${DocumentTypes.ACCESS_LEVEL}${SEPARATOR}${baseId}`
}

// Permissions
exports.READ_TABLE = "read-table"
exports.WRITE_TABLE = "write-table"
exports.READ_VIEW = "read-view"
exports.EXECUTE_AUTOMATION = "execute-automation"
exports.EXECUTE_WEBHOOK = "execute-webhook"
exports.USER_MANAGEMENT = "user-management"
exports.BUILDER = "builder"
exports.LIST_USERS = "list-users"
// Access Level IDs
exports.ADMIN_LEVEL_ID = "ADMIN"
exports.POWERUSER_LEVEL_ID = "POWER_USER"
exports.BUILDER_LEVEL_ID = "BUILDER"
exports.ANON_LEVEL_ID = "ANON"
exports.BUILTIN_LEVELS = {
  admin: { _id: makeAccessLevelId("ADMIN"), name: "Admin" },
  power: { _id: makeAccessLevelId("POWER_USER"), name: "Power user" },
  builder: { _id: makeAccessLevelId("BUILDER"), name: "Builder" },
  anon: { _id: makeAccessLevelId("ANON"), name: "Anonymous" },
}
exports.BUILTIN_LEVEL_IDS = Object.values(exports.BUILTIN_LEVELS).map(
  level => level._id
)
exports.PRETTY_ACCESS_LEVELS = {
  [exports.ADMIN_LEVEL_ID]: "Admin",
  [exports.POWERUSER_LEVEL_ID]: "Power user",
  [exports.BUILDER_LEVEL_ID]: "Builder",
}
exports.adminPermissions = [
  {
    name: exports.USER_MANAGEMENT,
  },
]

// to avoid circular dependencies this is included later, after exporting all enums
const permissions = require("../permissions")
exports.generateAdminPermissions = permissions.generateAdminPermissions
exports.generatePowerUserPermissions = permissions.generatePowerUserPermissions
