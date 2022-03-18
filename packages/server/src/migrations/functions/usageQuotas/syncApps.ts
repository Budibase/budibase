import { getTenantId } from "@budibase/backend-core/tenancy"
import { getAllApps } from "@budibase/backend-core/db"
import { quotas, QuotaUsageType, StaticQuotaName } from "@budibase/pro"

export const run = async () => {
  // get app count
  // @ts-ignore
  const devApps = await getAllApps({ dev: true })
  const appCount = devApps ? devApps.length : 0

  // sync app count
  const tenantId = getTenantId()
  console.log(`[Tenant: ${tenantId}] Syncing app count: ${appCount}`)
  await quotas.setUsage(appCount, StaticQuotaName.APPS, QuotaUsageType.STATIC)
}
