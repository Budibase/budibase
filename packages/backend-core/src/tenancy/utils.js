const { DEFAULT_TENANT_ID } = require("../constants")
const { StaticDatabases, SEPARATOR } = require("../db/constants")

exports.baseGlobalDBName = tenantId => {
  let dbName
  if (!tenantId || tenantId === DEFAULT_TENANT_ID) {
    dbName = StaticDatabases.GLOBAL.name
  } else {
    dbName = `${tenantId}${SEPARATOR}${StaticDatabases.GLOBAL.name}`
  }
  return dbName
}
