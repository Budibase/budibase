import { getTenantId } from "@budibase/backend-core/tenancy"
import { utils } from "@budibase/backend-core"
import * as Pro from "@budibase/pro"

export const run = async () => {
  // get developer count
  const developerCount = await utils.getBuildersCount()

  // sync developer count
  const tenantId = getTenantId()
  console.log(
    `[Tenant: ${tenantId}] Syncing developer count: ${developerCount}`
  )
  await Pro.Licensing.Quotas.setUsage(
    developerCount,
    Pro.StaticQuotaName.DEVELOPERS,
    Pro.QuotaUsageType.STATIC
  )
}
