import { DEFAULT_TENANT_ID } from "../constants"
import { StaticDatabases, SEPARATOR } from "../db/constants"

export const baseGlobalDBName = (tenantId: string | undefined | null) => {
  let dbName
  if (!tenantId || tenantId === DEFAULT_TENANT_ID) {
    dbName = StaticDatabases.GLOBAL.name
  } else {
    dbName = `${tenantId}${SEPARATOR}${StaticDatabases.GLOBAL.name}`
  }
  return dbName
}
