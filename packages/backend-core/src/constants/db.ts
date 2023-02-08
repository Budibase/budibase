export const SEPARATOR = "_"
export const UNICODE_MAX = "\ufff0"

/**
 * Can be used to create a few different forms of querying a view.
 */
export enum AutomationViewMode {
  ALL = "all",
  AUTOMATION = "automation",
  STATUS = "status",
}

export enum ViewName {
  USER_BY_APP = "by_app",
  USER_BY_EMAIL = "by_email2",
  BY_API_KEY = "by_api_key",
  USER_BY_BUILDERS = "by_builders",
  LINK = "by_link",
  ROUTING = "screen_routes",
  AUTOMATION_LOGS = "automation_logs",
  ACCOUNT_BY_EMAIL = "account_by_email",
  PLATFORM_USERS_LOWERCASE = "platform_users_lowercase",
  USER_BY_GROUP = "by_group_user",
  APP_BACKUP_BY_TRIGGER = "by_trigger",
}

export const DeprecatedViews = {
  [ViewName.USER_BY_EMAIL]: [
    // removed due to inaccuracy in view doc filter logic
    "by_email",
  ],
}

export enum InternalTable {
  USER_METADATA = "ta_users",
}

export enum DocumentType {
  USER = "us",
  GROUP = "gr",
  WORKSPACE = "workspace",
  CONFIG = "config",
  TEMPLATE = "template",
  APP = "app",
  DEV = "dev",
  APP_DEV = "app_dev",
  APP_METADATA = "app_metadata",
  ROLE = "role",
  MIGRATIONS = "migrations",
  DEV_INFO = "devinfo",
  AUTOMATION_LOG = "log_au",
  ACCOUNT_METADATA = "acc_metadata",
  PLUGIN = "plg",
  DATASOURCE = "datasource",
  DATASOURCE_PLUS = "datasource_plus",
  APP_BACKUP = "backup",
  TABLE = "ta",
  ROW = "ro",
  AUTOMATION = "au",
  LINK = "li",
  WEBHOOK = "wh",
  INSTANCE = "inst",
  LAYOUT = "layout",
  SCREEN = "screen",
  QUERY = "query",
  DEPLOYMENTS = "deployments",
  METADATA = "metadata",
  MEM_VIEW = "view",
  USER_FLAG = "flag",
  AUTOMATION_METADATA = "meta_au",
}

export const StaticDatabases = {
  GLOBAL: {
    name: "global-db",
    docs: {
      apiKeys: "apikeys",
      usageQuota: "usage_quota",
      licenseInfo: "license_info",
      environmentVariables: "environmentvariables",
    },
  },
  // contains information about tenancy and so on
  PLATFORM_INFO: {
    name: "global-info",
    docs: {
      tenants: "tenants",
      install: "install",
    },
  },
}

export const APP_PREFIX = DocumentType.APP + SEPARATOR
export const APP_DEV = DocumentType.APP_DEV + SEPARATOR
export const APP_DEV_PREFIX = APP_DEV
export const BUDIBASE_DATASOURCE_TYPE = "budibase"
