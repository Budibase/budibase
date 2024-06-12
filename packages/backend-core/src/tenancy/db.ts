import { getDB } from "../db/db"
import { getGlobalDBName } from "../context"
import { TenantInfo } from "@budibase/types"

export function getTenantDB(tenantId: string) {
  return getDB(getGlobalDBName(tenantId))
}

export async function saveTenantInfo(tenantInfo: TenantInfo) {
  const db = getTenantDB(tenantInfo.tenantId)
  // save the tenant info to db
  return await db.put({
    _id: "tenant_info",
    ...tenantInfo,
  })
}
