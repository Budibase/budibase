import { getGlobalDB, getTenantId } from "@budibase/backend-core/tenancy"
import { getAllApps } from "@budibase/backend-core/db"
import { getUsageQuotaDoc } from "../../../utilities/usageQuota"
import { getUniqueRows } from "../../../utilities/usageQuota/rows"

export const run = async () => {
  const db = getGlobalDB()
  // get all rows in all apps
  // @ts-ignore
  const allApps = await getAllApps({ all: true })
  // @ts-ignore
  const appIds = allApps ? allApps.map((app: { appId: any }) => app.appId) : []
  const rows = await getUniqueRows(appIds)
  const rowCount = rows ? rows.length : 0

  // sync row count
  const tenantId = getTenantId()
  console.log(`[Tenant: ${tenantId}] Syncing row count: ${rowCount}`)
  const usageDoc = await getUsageQuotaDoc(db)
  usageDoc.usageQuota.rows = rowCount
  await db.put(usageDoc)
}
