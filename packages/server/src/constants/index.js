const { BUILTIN_ROLE_IDS } = require("@budibase/backend-core/roles")
const { UserStatus } = require("@budibase/backend-core/constants")
const { ObjectStoreBuckets } = require("@budibase/backend-core/objectStore")

exports.JobQueues = {
  AUTOMATIONS: "automationQueue",
}

const FilterTypes = {
  STRING: "string",
  FUZZY: "fuzzy",
  RANGE: "range",
  EQUAL: "equal",
  NOT_EQUAL: "notEqual",
  EMPTY: "empty",
  NOT_EMPTY: "notEmpty",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ONE_OF: "oneOf",
}

exports.FilterTypes = FilterTypes
exports.NoEmptyFilterStrings = [
  FilterTypes.STRING,
  FilterTypes.FUZZY,
  FilterTypes.EQUAL,
  FilterTypes.NOT_EQUAL,
  FilterTypes.CONTAINS,
  FilterTypes.NOT_CONTAINS,
]

exports.FieldTypes = {
  STRING: "string",
  LONGFORM: "longform",
  OPTIONS: "options",
  NUMBER: "number",
  BOOLEAN: "boolean",
  ARRAY: "array",
  DATETIME: "datetime",
  ATTACHMENT: "attachment",
  LINK: "link",
  FORMULA: "formula",
  AUTO: "auto",
  JSON: "json",
  INTERNAL: "internal",
}

exports.CanSwitchTypes = [
  [exports.FieldTypes.JSON, exports.FieldTypes.ARRAY],
  [
    exports.FieldTypes.STRING,
    exports.FieldTypes.OPTIONS,
    exports.FieldTypes.LONGFORM,
  ],
  [exports.FieldTypes.BOOLEAN, exports.FieldTypes.NUMBER],
]

exports.SwitchableTypes = exports.CanSwitchTypes.reduce((prev, current) =>
  prev ? prev.concat(current) : current
)

exports.RelationshipTypes = {
  ONE_TO_MANY: "one-to-many",
  MANY_TO_ONE: "many-to-one",
  MANY_TO_MANY: "many-to-many",
}

exports.FormulaTypes = {
  STATIC: "static",
  DYNAMIC: "dynamic",
}

exports.AuthTypes = {
  APP: "app",
  BUILDER: "builder",
  EXTERNAL: "external",
}

exports.DataSourceOperation = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  BULK_CREATE: "BULK_CREATE",
  CREATE_TABLE: "CREATE_TABLE",
  UPDATE_TABLE: "UPDATE_TABLE",
  DELETE_TABLE: "DELETE_TABLE",
}

exports.DatasourceAuthTypes = {
  GOOGLE: "google",
}

exports.SortDirection = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING",
}

exports.USERS_TABLE_SCHEMA = {
  _id: "ta_users",
  type: "table",
  views: {},
  name: "Users",
  // TODO: ADMIN PANEL - when implemented this doesn't need to be carried out
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
    firstName: {
      name: "firstName",
      fieldName: "firstName",
      type: exports.FieldTypes.STRING,
      constraints: {
        type: exports.FieldTypes.STRING,
        presence: false,
      },
    },
    lastName: {
      name: "lastName",
      fieldName: "lastName",
      type: exports.FieldTypes.STRING,
      constraints: {
        type: exports.FieldTypes.STRING,
        presence: false,
      },
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
    status: {
      fieldName: "status",
      name: "status",
      type: exports.FieldTypes.OPTIONS,
      constraints: {
        type: exports.FieldTypes.STRING,
        presence: false,
        inclusion: Object.values(UserStatus),
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

exports.AutoFieldDefaultNames = {
  CREATED_BY: "Created By",
  CREATED_AT: "Created At",
  UPDATED_BY: "Updated By",
  UPDATED_AT: "Updated At",
  AUTO_ID: "Auto ID",
}

exports.OBJ_STORE_DIRECTORY = "/prod-budi-app-assets"
exports.BaseQueryVerbs = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
}

exports.MetadataTypes = {
  AUTOMATION_TEST_INPUT: "automationTestInput",
  AUTOMATION_TEST_HISTORY: "automationTestHistory",
}

exports.InvalidColumns = {
  ID: "_id",
  REV: "_rev",
  TABLE_ID: "tableId",
}

exports.BuildSchemaErrors = {
  NO_KEY: "no_key",
  INVALID_COLUMN: "invalid_column",
}

exports.WebhookType = {
  AUTOMATION: "automation",
}

exports.AutomationErrors = {
  INCORRECT_TYPE: "INCORRECT_TYPE",
  MAX_ITERATIONS: "MAX_ITERATIONS_REACHED",
  FAILURE_CONDITION: "FAILURE_CONDITION_MET",
}

exports.LoopStepTypes = {
  ARRAY: "Array",
  STRING: "String",
}

// pass through the list from the auth/core lib
exports.ObjectStoreBuckets = ObjectStoreBuckets
