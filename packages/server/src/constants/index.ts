import { BUILTIN_ROLE_IDS } from "@budibase/backend-core/roles"
import { UserStatus } from "@budibase/backend-core/constants"
import { objectStore } from "@budibase/backend-core"

export const ObjectStoreBuckets = objectStore.ObjectStoreBuckets

export const JobQueues = {
  AUTOMATIONS: "automationQueue",
}

export const FilterTypes = {
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

export const NoEmptyFilterStrings = [
  FilterTypes.STRING,
  FilterTypes.FUZZY,
  FilterTypes.EQUAL,
  FilterTypes.NOT_EQUAL,
  FilterTypes.CONTAINS,
  FilterTypes.NOT_CONTAINS,
]

export const FieldTypes = {
  STRING: "string",
  BARCODEQR: "barcodeqr",
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

export const CanSwitchTypes = [
  [FieldTypes.JSON, FieldTypes.ARRAY],
  [
    FieldTypes.STRING,
    FieldTypes.OPTIONS,
    FieldTypes.LONGFORM,
    FieldTypes.BARCODEQR,
  ],
  [FieldTypes.BOOLEAN, FieldTypes.NUMBER],
]

export const SwitchableTypes = CanSwitchTypes.reduce((prev, current) =>
  prev ? prev.concat(current) : current
)

export const RelationshipTypes = {
  ONE_TO_MANY: "one-to-many",
  MANY_TO_ONE: "many-to-one",
  MANY_TO_MANY: "many-to-many",
}

export const FormulaTypes = {
  STATIC: "static",
  DYNAMIC: "dynamic",
}

export const AuthTypes = {
  APP: "app",
  BUILDER: "builder",
  EXTERNAL: "external",
}

export const DataSourceOperation = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  BULK_CREATE: "BULK_CREATE",
  CREATE_TABLE: "CREATE_TABLE",
  UPDATE_TABLE: "UPDATE_TABLE",
  DELETE_TABLE: "DELETE_TABLE",
}

export const DatasourceAuthTypes = {
  GOOGLE: "google",
}

export const SortDirection = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING",
}

export const USERS_TABLE_SCHEMA = {
  _id: "ta_users",
  type: "table",
  views: {},
  name: "Users",
  // TODO: ADMIN PANEL - when implemented this doesn't need to be carried out
  schema: {
    email: {
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
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
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        presence: false,
      },
    },
    lastName: {
      name: "lastName",
      fieldName: "lastName",
      type: FieldTypes.STRING,
      constraints: {
        type: FieldTypes.STRING,
        presence: false,
      },
    },
    roleId: {
      fieldName: "roleId",
      name: "roleId",
      type: FieldTypes.OPTIONS,
      constraints: {
        type: FieldTypes.STRING,
        presence: false,
        inclusion: Object.values(BUILTIN_ROLE_IDS),
      },
    },
    status: {
      fieldName: "status",
      name: "status",
      type: FieldTypes.OPTIONS,
      constraints: {
        type: FieldTypes.STRING,
        presence: false,
        inclusion: Object.values(UserStatus),
      },
    },
  },
  primaryDisplay: "email",
}

export const AutoFieldSubTypes = {
  CREATED_BY: "createdBy",
  CREATED_AT: "createdAt",
  UPDATED_BY: "updatedBy",
  UPDATED_AT: "updatedAt",
  AUTO_ID: "autoID",
}

export const AutoFieldDefaultNames = {
  CREATED_BY: "Created By",
  CREATED_AT: "Created At",
  UPDATED_BY: "Updated By",
  UPDATED_AT: "Updated At",
  AUTO_ID: "Auto ID",
}

export const BaseQueryVerbs = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
}

export const MetadataTypes = {
  AUTOMATION_TEST_INPUT: "automationTestInput",
  AUTOMATION_TEST_HISTORY: "automationTestHistory",
}

export const InvalidColumns = {
  ID: "_id",
  REV: "_rev",
  TABLE_ID: "tableId",
}

export const BuildSchemaErrors = {
  NO_KEY: "no_key",
  INVALID_COLUMN: "invalid_column",
}

export const WebhookType = {
  AUTOMATION: "automation",
}

export const AutomationErrors = {
  INCORRECT_TYPE: "INCORRECT_TYPE",
  MAX_ITERATIONS: "MAX_ITERATIONS_REACHED",
  FAILURE_CONDITION: "FAILURE_CONDITION_MET",
}

export const MAX_AUTOMATION_RECURRING_ERRORS = 5
