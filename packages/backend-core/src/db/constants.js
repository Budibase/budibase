exports.SEPARATOR = "_"
exports.UNICODE_MAX = "\ufff0"

const PRE_APP = "app"
const PRE_DEV = "dev"

/**
 * Can be used to create a few different forms of querying a view.
 */
exports.ViewModes = {
  ALL: "all",
  AUTOMATION: "auto",
  STATUS: "status",
}

exports.ViewNames = {
  USER_BY_EMAIL: "by_email",
  BY_API_KEY: "by_api_key",
  USER_BY_BUILDERS: "by_builders",
  LINK: "by_link",
  ROUTING: "screen_routes",
  AUTO_LOGS: "auto_log",
}

exports.DocumentTypes = {
  USER: "us",
  WORKSPACE: "workspace",
  CONFIG: "config",
  TEMPLATE: "template",
  APP: PRE_APP,
  DEV: PRE_DEV,
  APP_DEV: `${PRE_APP}${exports.SEPARATOR}${PRE_DEV}`,
  APP_METADATA: `${PRE_APP}${exports.SEPARATOR}metadata`,
  ROLE: "role",
  MIGRATIONS: "migrations",
  DEV_INFO: "devinfo",
  AUTOMATION_LOG: "log_au",
}

exports.StaticDatabases = {
  GLOBAL: {
    name: "global-db",
    docs: {
      apiKeys: "apikeys",
      usageQuota: "usage_quota",
      licenseInfo: "license_info",
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

exports.APP_PREFIX = exports.DocumentTypes.APP + exports.SEPARATOR
exports.APP_DEV = exports.APP_DEV_PREFIX =
  exports.DocumentTypes.APP_DEV + exports.SEPARATOR
