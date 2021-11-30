export const TableNames = {
  USERS: "ta_users",
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

export const IntegrationTypes = {
  POSTGRES: "POSTGRES",
  MONGODB: "MONGODB",
  COUCHDB: "COUCHDB",
  S3: "S3",
  MYSQL: "MYSQL",
  REST: "REST",
  DYNAMODB: "DYNAMODB",
  ELASTICSEARCH: "ELASTICSEARCH",
  SQL_SERVER: "SQL_SERVER",
  AIRTABLE: "AIRTABLE",
  ARANGODB: "ARANGODB",
  ORACLE: "ORACLE",
  INTERNAL: "INTERNAL",
}

export const IntegrationNames = {
  [IntegrationTypes.POSTGRES]: "PostgreSQL",
  [IntegrationTypes.MONGODB]: "MongoDB",
  [IntegrationTypes.COUCHDB]: "CouchDB",
  [IntegrationTypes.S3]: "S3",
  [IntegrationTypes.MYSQL]: "MySQL",
  [IntegrationTypes.REST]: "REST",
  [IntegrationTypes.DYNAMODB]: "DynamoDB",
  [IntegrationTypes.ELASTICSEARCH]: "ElasticSearch",
  [IntegrationTypes.SQL_SERVER]: "SQL Server",
  [IntegrationTypes.AIRTABLE]: "Airtable",
  [IntegrationTypes.ARANGODB]: "ArangoDB",
  [IntegrationTypes.ORACLE]: "Oracle",
  [IntegrationTypes.INTERNAL]: "Internal",
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

export const APP_NAME_REGEX = /^[\w\s]+$/
