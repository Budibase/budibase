import { getDB } from "../db/db"
import { getGlobalDBName } from "../context"

export function getTenantDB(tenantId: string) {
  return getDB(getGlobalDBName(tenantId))
}
