const { BUILTIN_ROLE_IDS } = require("../utilities/security/roles")

exports.FieldTypes = {
  STRING: "string",
  LONGFORM: "longform",
  OPTIONS: "options",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATETIME: "datetime",
  ATTACHMENT: "attachment",
  LINK: "link",
  AUTO: "auto",
}

exports.AuthTypes = {
  APP: "app",
  BUILDER: "builder",
  EXTERNAL: "external",
}

exports.USERS_TABLE_SCHEMA = {
  _id: "ta_users",
  type: "table",
  views: {},
  name: "Users",
  schema: {
    email: {
      type: exports.FieldTypes.STRING,
      constraints: {
        type: exports.FieldTypes.STRING,
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
      type: exports.FieldTypes.OPTIONS,
      constraints: {
        type: exports.FieldTypes.STRING,
        presence: false,
        inclusion: Object.values(BUILTIN_ROLE_IDS),
      },
    },
    active: {
      fieldName: "active",
      name: "active",
      type: exports.FieldTypes.BOOLEAN,
      constraints: {
        type: exports.FieldTypes.BOOLEAN,
        presence: false,
      },
    },
  },
  primaryDisplay: "email",
}

exports.AutoFieldSubTypes = {
  CREATED_BY: "createdBy",
  CREATED_AT: "createdAt",
  UPDATED_BY: "updatedBy",
  UPDATED_AT: "updatedAt",
  AUTO_ID: "autoID",
}

exports.BUILDER_CONFIG_DB = "builder-config-db"
exports.HOSTING_DOC = "hosting-doc"
exports.OBJ_STORE_DIRECTORY = "/app-assets/assets"
exports.BaseQueryVerbs = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
}
