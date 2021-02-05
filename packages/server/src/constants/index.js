const { BUILTIN_ROLE_IDS } = require("../utilities/security/roles")

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
    email: {
      type: "string",
      constraints: {
        type: "string",
        email: true,
        length: {
          maximum: "",
        },
        presence: true,
      },
      fieldName: "email",
      name: "email",
    },
    roleId: {
      fieldName: "roleId",
      name: "roleId",
      type: "options",
      constraints: {
        type: "string",
        presence: false,
        inclusion: Object.values(BUILTIN_ROLE_IDS),
      },
    },
  },
  primaryDisplay: "email",
}

exports.AuthTypes = AuthTypes
exports.USERS_TABLE_SCHEMA = USERS_TABLE_SCHEMA
exports.BUILDER_CONFIG_DB = "builder-config-db"
exports.HOSTING_DOC = "hosting-doc"
exports.OBJ_STORE_DIRECTORY = "/app-assets/assets"
