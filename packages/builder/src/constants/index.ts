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

export const ChangelogURL = "https://docs.budibase.com/changelog"

export const enum AutoScreenTypes {
  BLANK = "blank",
  TABLE = "table",
  FORM = "form",
  PDF = "pdf",
}

export const BudibaseRoles = {
  AppUser: "appUser",
  Developer: "developer",
  Creator: "creator",
  Admin: "admin",
  Owner: "owner",
}

const BudibaseRoleOptionsOld = [
  {
    label: "Developer",
    value: BudibaseRoles.Developer,
    sortOrder: 2,
  },
]
export const BudibaseRoleOptions = [
  {
    label: "Tenant admin",
    value: BudibaseRoles.Admin,
    subtitle: "Has full access to all workspaces in your tenant",
    sortOrder: 1,
  },
  {
    label: "Creator",
    value: BudibaseRoles.Creator,
    subtitle: "Can create and edit apps they have access to",
    sortOrder: 2,
  },
  {
    label: "App user",
    value: BudibaseRoles.AppUser,
    subtitle: "Can only use published apps they have access to",
    sortOrder: 3,
  },
]
export const ExtendedBudibaseRoleOptions = [
  {
    label: "Account holder",
    value: BudibaseRoles.Owner,
    sortOrder: 0,
  },
  ...BudibaseRoleOptions,
  ...BudibaseRoleOptionsOld,
]
