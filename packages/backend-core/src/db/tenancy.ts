import { DEFAULT_TENANT_ID } from "../constants"
import { StaticDatabases, SEPARATOR } from "./constants"
import { getTenantId } from "../context"

export const getGlobalDBName = (tenantId?: string) => {
  // tenant ID can be set externally, for example user API where
  // new tenants are being created, this may be the case
  if (!tenantId) {
    tenantId = getTenantId()
  }
  return baseGlobalDBName(tenantId)
}

export const baseGlobalDBName = (tenantId: string | undefined | null) => {
  let dbName
  if (!tenantId || tenantId === DEFAULT_TENANT_ID) {
    dbName = StaticDatabases.GLOBAL.name
  } else {
    dbName = `${tenantId}${SEPARATOR}${StaticDatabases.GLOBAL.name}`
  }
  return dbName
}
