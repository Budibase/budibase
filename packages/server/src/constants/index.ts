import { constants, objectStore, roles } from "@budibase/backend-core"
import {
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  Table,
  TableSourceType,
} from "@budibase/types"

import env from "../environment"

export const AWS_REGION = env.AWS_REGION ? env.AWS_REGION : "eu-west-1"

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
  CONTAINS_ANY = "containsAny",
  ONE_OF = "oneOf",
}

export const CanSwitchTypes = [
  [FieldType.JSON, FieldType.ARRAY],
  [
    FieldType.STRING,
    FieldType.OPTIONS,
    FieldType.LONGFORM,
    FieldType.BARCODEQR,
  ],
  [FieldType.BOOLEAN, FieldType.NUMBER],
]

export const SwitchableTypes = CanSwitchTypes.reduce((prev, current) =>
  prev ? prev.concat(current) : current
)

export enum AuthTypes {
  APP = "app",
  BUILDER = "builder",
  EXTERNAL = "external",
}

export enum DatasourceAuthTypes {
  GOOGLE = "google",
}

export const USERS_TABLE_SCHEMA: Table = {
  _id: "ta_users",
  type: "table",
  sourceId: INTERNAL_TABLE_SOURCE_ID,
  sourceType: TableSourceType.INTERNAL,
  views: {},
  name: "Users",
  // TODO: ADMIN PANEL - when implemented this doesn't need to be carried out
  schema: {
    email: {
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        email: true,
        length: {
          maximum: "",
        },
        presence: true,
      },
      name: "email",
    },
    firstName: {
      name: "firstName",
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        presence: false,
      },
    },
    lastName: {
      name: "lastName",
      type: FieldType.STRING,
      constraints: {
        type: FieldType.STRING,
        presence: false,
      },
    },
    roleId: {
      name: "roleId",
      type: FieldType.OPTIONS,
      constraints: {
        type: FieldType.STRING,
        presence: false,
        inclusion: Object.values(roles.BUILTIN_ROLE_IDS),
      },
    },
    status: {
      name: "status",
      type: FieldType.OPTIONS,
      constraints: {
        type: FieldType.STRING,
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

export enum InvalidColumns {
  ID = "_id",
  REV = "_rev",
  TABLE_ID = "tableId",
}

export enum AutomationErrors {
  INCORRECT_TYPE = "INCORRECT_TYPE",
  FAILURE_CONDITION = "FAILURE_CONDITION_MET",
}

// pass through the list from the auth/core lib
export const ObjectStoreBuckets = objectStore.ObjectStoreBuckets
export const MAX_AUTOMATION_RECURRING_ERRORS = 5
export const GOOGLE_SHEETS_PRIMARY_KEY = "rowNumber"
export const DEFAULT_JOBS_TABLE_ID = constants.DEFAULT_JOBS_TABLE_ID
export const DEFAULT_INVENTORY_TABLE_ID = constants.DEFAULT_INVENTORY_TABLE_ID
export const DEFAULT_EXPENSES_TABLE_ID = constants.DEFAULT_EXPENSES_TABLE_ID
export const DEFAULT_EMPLOYEE_TABLE_ID = constants.DEFAULT_EMPLOYEE_TABLE_ID
export const DEFAULT_BB_DATASOURCE_ID = constants.DEFAULT_BB_DATASOURCE_ID
export const DEFAULT_TABLE_IDS = [
  DEFAULT_JOBS_TABLE_ID,
  DEFAULT_INVENTORY_TABLE_ID,
  DEFAULT_EXPENSES_TABLE_ID,
  DEFAULT_EMPLOYEE_TABLE_ID,
]
