import { objectStore, roles, constants } from "@budibase/backend-core"
import { FieldType as FieldTypes } from "@budibase/types"
export {
  FieldType as FieldTypes,
  RelationshipType,
  AutoFieldSubTypes,
  FormulaTypes,
} from "@budibase/types"

export enum FilterTypes {
  STRING = "string",
  FUZZY = "fuzzy",
  RANGE = "range",
  EQUAL = "equal",
  NOT_EQUAL = "notEqual",
  EMPTY = "empty",
  NOT_EMPTY = "notEmpty",
  CONTAINS = "contains",
  NOT_CONTAINS = "notContains",
  ONE_OF = "oneOf",
}

export const NoEmptyFilterStrings = [
  FilterTypes.STRING,
  FilterTypes.FUZZY,
  FilterTypes.EQUAL,
  FilterTypes.NOT_EQUAL,
  FilterTypes.CONTAINS,
  FilterTypes.NOT_CONTAINS,
]

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

export enum AuthTypes {
  APP = "app",
  BUILDER = "builder",
  EXTERNAL = "external",
}

export enum DataSourceOperation {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  BULK_CREATE = "BULK_CREATE",
  CREATE_TABLE = "CREATE_TABLE",
  UPDATE_TABLE = "UPDATE_TABLE",
  DELETE_TABLE = "DELETE_TABLE",
}

export enum DatasourceAuthTypes {
  GOOGLE = "google",
}

export enum SortDirection {
  ASCENDING = "ASCENDING",
  DESCENDING = "DESCENDING",
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
        inclusion: Object.values(roles.BUILTIN_ROLE_IDS),
      },
    },
    status: {
      fieldName: "status",
      name: "status",
      type: FieldTypes.OPTIONS,
      constraints: {
        type: FieldTypes.STRING,
        presence: false,
        inclusion: Object.values(constants.UserStatus),
      },
    },
  },
  primaryDisplay: "email",
}

export enum AutoFieldDefaultNames {
  CREATED_BY = "Created By",
  CREATED_AT = "Created At",
  UPDATED_BY = "Updated By",
  UPDATED_AT = "Updated At",
  AUTO_ID = "Auto ID",
}

export const OBJ_STORE_DIRECTORY = "/prod-budi-app-assets"
export enum BaseQueryVerbs {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}

export enum MetadataTypes {
  AUTOMATION_TEST_INPUT = "automationTestInput",
  AUTOMATION_TEST_HISTORY = "automationTestHistory",
}

export enum InvalidColumns {
  ID = "_id",
  REV = "_rev",
  TABLE_ID = "tableId",
}

export enum BuildSchemaErrors {
  NO_KEY = "no_key",
  INVALID_COLUMN = "invalid_column",
}

export enum AutomationErrors {
  INCORRECT_TYPE = "INCORRECT_TYPE",
  MAX_ITERATIONS = "MAX_ITERATIONS_REACHED",
  FAILURE_CONDITION = "FAILURE_CONDITION_MET",
}

// pass through the list from the auth/core lib
export const ObjectStoreBuckets = objectStore.ObjectStoreBuckets
export const MAX_AUTOMATION_RECURRING_ERRORS = 5
export const GOOGLE_SHEETS_PRIMARY_KEY = "rowNumber"
