import { getTenantId } from "@budibase/backend-core/tenancy"
import { getAllApps } from "@budibase/backend-core/db"
import * as Pro from "@budibase/pro"

export const run = async () => {
  // get app count
  // @ts-ignore
  const devApps = await getAllApps({ dev: true })
  const appCount = devApps ? devApps.length : 0

  // sync app count
  const tenantId = getTenantId()
  console.log(`[Tenant: ${tenantId}] Syncing app count: ${appCount}`)
  await Pro.Licensing.Quotas.setUsage(
    appCount,
    Pro.StaticQuotaName.APPS,
    Pro.QuotaUsageType.STATIC
  )
}
