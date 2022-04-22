import { Roles } from "./backend"

export const TableNames = {
  USERS: "ta_users",
}

export const RoleColours = {
  [Roles.ADMIN]: "var(--spectrum-global-color-static-seafoam-400)",
  [Roles.POWER]: "var(--spectrum-global-color-static-purple-400)",
  [Roles.BASIC]: "var(--spectrum-global-color-static-magenta-400)",
  [Roles.PUBLIC]: "var(--spectrum-global-color-static-yellow-400)",
}

export const FrontendTypes = {
  PAGE: "page",
  SCREEN: "screen",
  LAYOUT: "layout",
  NONE: "none",
}

export const AppStatus = {
  ALL: "all",
  DEV: "development",
  DEPLOYED: "published",
}

export const IntegrationNames = {
  POSTGRES: "PostgreSQL",
  MONGODB: "MongoDB",
  COUCHDB: "CouchDB",
  S3: "S3",
  MYSQL: "MySQL",
  REST: "REST",
  DYNAMODB: "DynamoDB",
  ELASTICSEARCH: "ElasticSearch",
  SQL_SERVER: "SQL Server",
  AIRTABLE: "Airtable",
  ARANGODB: "ArangoDB",
  ORACLE: "Oracle",
  GOOGLE_SHEETS: "Google Sheets",
}

// fields on the user table that cannot be edited
export const UNEDITABLE_USER_FIELDS = [
  "email",
  "password",
  "roleId",
  "status",
  "firstName",
  "lastName",
]

export const UNSORTABLE_TYPES = ["formula", "attachment", "array", "link"]

export const LAYOUT_NAMES = {
  MASTER: {
    PRIVATE: "layout_private_master",
    PUBLIC: "layout_private_master",
  },
}

export const BUDIBASE_INTERNAL_DB = "bb_internal"

// one or more word characters and whitespace
export const APP_NAME_REGEX = /^[\w\s]+$/
// zero or more non-whitespace characters
export const APP_URL_REGEX = /^\S*$/
