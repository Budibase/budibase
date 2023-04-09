import { users } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"

export const run = async () => {
  // get user
  const userCount = await users.getUserCount()

  // sync app count
  console.log(`Syncing user count: ${userCount}`)
  await quotas.setUsage(userCount, StaticQuotaName.USERS, QuotaUsageType.STATIC)
}
