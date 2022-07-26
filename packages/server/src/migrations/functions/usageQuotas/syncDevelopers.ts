import { getTenantId } from "@budibase/backend-core/tenancy"
import { utils } from "@budibase/backend-core"
import { quotas, QuotaUsageType, StaticQuotaName } from "@budibase/pro"

export const run = async () => {
  // get developer count
  const developerCount = await utils.getBuildersCount()

  // sync developer count
  const tenantId = getTenantId()
  console.log(
    `[Tenant: ${tenantId}] Syncing developer count: ${developerCount}`
  )
  await quotas.setUsage(
    developerCount,
    StaticQuotaName.DEVELOPERS,
    QuotaUsageType.STATIC
  )
}
