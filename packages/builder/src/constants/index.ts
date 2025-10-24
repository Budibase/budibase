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

export const LAYOUT_NAMES = {
  MASTER: {
    PRIVATE: "layout_private_master",
    PUBLIC: "layout_private_master",
  },
}

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
}

export const CHANGELOG_URL = "https://docs.budibase.com/changelog"
export const DISCORD_URL = "https://discord.com/invite/ZepTmGbtfF"
export const DOCUMENTATION_URL = "https://docs.budibase.com/docs"
export const GITHUB_DISCUSSIONS_URL =
  "https://github.com/Budibase/budibase/discussions"
export const BUDIBASE_UNIVERSITY_URL =
  "https://vimeo.com/showcase/budibase-university"
export const SUPPORT_EMAIL = "mailto:support@budibase.com"

export const enum AutoScreenTypes {
  BLANK = "blank",
  TABLE = "table",
  FORM = "form",
  PDF = "pdf",
}
