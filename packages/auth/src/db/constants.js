exports.SEPARATOR = "_"

exports.StaticDatabases = {
  GLOBAL: {
    name: "global-db",
    docs: {
      apiKeys: "apikeys",
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