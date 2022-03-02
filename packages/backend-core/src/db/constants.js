exports.SEPARATOR = "_"

const PRE_APP = "app"
const PRE_DEV = "dev"

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
}

exports.StaticDatabases = {
  GLOBAL: {
    name: "global-db",
    docs: {
      apiKeys: "apikeys",
      usageQuota: "usage_quota",
    },
  },
  // contains information about tenancy and so on
  PLATFORM_INFO: {
    name: "global-info",
    docs: {
      tenants: "tenants",
    },
  },
}

exports.APP_PREFIX = exports.DocumentTypes.APP + exports.SEPARATOR
exports.APP_DEV = exports.APP_DEV_PREFIX =
  exports.DocumentTypes.APP_DEV + exports.SEPARATOR
