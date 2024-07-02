import { getDB } from "../db/db"
import { getGlobalDBName } from "../context"
import { TenantInfo } from "@budibase/types"

export function getTenantDB(tenantId: string) {
  return getDB(getGlobalDBName(tenantId))
}

export async function saveTenantInfo(tenantInfo: TenantInfo) {
  const db = getTenantDB(tenantInfo.tenantId)
  // save the tenant info to db
  return db.put({
    _id: "tenant_info",
    ...tenantInfo,
  })
}

export async function getTenantInfo(tenantId: string): Promise<TenantInfo> {
  const db = getTenantDB(tenantId)
  return db.get("tenant_info")
}
