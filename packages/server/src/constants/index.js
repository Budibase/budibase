const { BUILTIN_LEVEL_IDS } = require("../utilities/security/accessLevels")

const AuthTypes = {
  APP: "app",
  BUILDER: "builder",
  EXTERNAL: "external",
}

const USERS_TABLE_SCHEMA = {
  _id: "ta_users",
  type: "table",
  views: {},
  name: "Users",
  schema: {
    username: {
      type: "string",
      constraints: {
        type: "string",
        length: {
          maximum: "",
        },
        presence: true,
      },
      fieldName: "username",
      name: "username",
    },
    accessLevelId: {
      fieldName: "accessLevelId",
      name: "accessLevelId",
      type: "options",
      constraints: {
        type: "string",
        presence: false,
        inclusion: Object.keys(BUILTIN_LEVEL_IDS),
      },
    },
  },
  primaryDisplay: "username",
}

exports.AuthTypes = AuthTypes
exports.USERS_TABLE_SCHEMA = USERS_TABLE_SCHEMA
