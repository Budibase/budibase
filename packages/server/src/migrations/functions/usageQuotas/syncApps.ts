import { getGlobalDB, getTenantId } from "@budibase/backend-core/tenancy"
import { getAllApps } from "@budibase/backend-core/db"
import { getUsageQuotaDoc } from "../../../utilities/usageQuota"

export const run = async () => {
  const db = getGlobalDB()
  // get app count
  // @ts-ignore
  const devApps = await getAllApps({ dev: true })
  const appCount = devApps ? devApps.length : 0

  // sync app count
  const tenantId = getTenantId()
  console.log(`[Tenant: ${tenantId}] Syncing app count: ${appCount}`)
  const usageDoc = await getUsageQuotaDoc(db)
  usageDoc.usageQuota.apps = appCount
  await db.put(usageDoc)
}
