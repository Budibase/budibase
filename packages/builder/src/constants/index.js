export const TableNames = {
  USERS: "ta_users",
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

// one or more word characters and whitespace
export const APP_NAME_REGEX = /^[\w\s]+$/
// zero or more non-whitespace characters
export const APP_URL_REGEX = /^[0-9a-zA-Z-_]+$/

export const DefaultAppTheme = {
  primaryColor: "var(--spectrum-global-color-blue-600)",
  primaryColorHover: "var(--spectrum-global-color-blue-500)",
  buttonBorderRadius: "16px",
  navBackground: "var(--spectrum-global-color-gray-50)",
  navTextColor: "var(--spectrum-global-color-gray-800)",
}

export const PluginSource = {
  URL: "URL",
  NPM: "NPM",
  GITHUB: "Github",
  FILE: "File Upload",
}

export const OnboardingType = {
  EMAIL: "email",
  PASSWORD: "password",
}

export const PlanModel = {
  PER_USER: "perUser",
  DAY_PASS: "dayPass",
}
