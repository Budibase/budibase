import { getTenantId } from "@budibase/backend-core/tenancy"
import { getAllApps } from "@budibase/backend-core/db"
import * as Pro from "@budibase/pro"

export const run = async () => {
  // get app count
  const opts: any = { dev: false }
  const prodApps = await getAllApps(opts)
  const prodAppCount = prodApps ? prodApps.length : 0

  // sync app count
  const tenantId = getTenantId()
  console.log(
    `[Tenant: ${tenantId}] Syncing published app count: ${prodAppCount}`
  )
  await Pro.Licensing.Quotas.setUsage(
    prodAppCount,
    Pro.StaticQuotaName.PUBLISHED_APPS,
    Pro.QuotaUsageType.STATIC
  )
}
