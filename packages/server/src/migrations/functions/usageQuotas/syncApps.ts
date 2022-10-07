import { getTenantId } from "@budibase/backend-core/tenancy"
import { getAllApps } from "@budibase/backend-core/db"
import { quotas } from "@budibase/pro"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"

export const run = async () => {
  // get app count
  const devApps = await getAllApps({ dev: true })
  const appCount = devApps ? devApps.length : 0

  // sync app count
  const tenantId = getTenantId()
  console.log(`[Tenant: ${tenantId}] Syncing app count: ${appCount}`)
  await quotas.setUsage(appCount, StaticQuotaName.APPS, QuotaUsageType.STATIC)
}
