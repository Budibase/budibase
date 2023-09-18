import { users } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"

export const run = async () => {
  const creatorCount = await users.getCreatorCount()
  console.log(`Syncing creator count: ${creatorCount}`)
  await quotas.setUsage(
    creatorCount,
    StaticQuotaName.CREATORS,
    QuotaUsageType.STATIC
  )
}
