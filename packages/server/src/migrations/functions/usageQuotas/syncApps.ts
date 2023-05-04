import { db as dbCore } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"

export const run = async () => {
  // get app count
  const devApps = await dbCore.getAllApps({ dev: true })
  const appCount = devApps ? devApps.length : 0

  // sync app count
  console.log(`Syncing app count: ${appCount}`)
  await quotas.setUsage(appCount, StaticQuotaName.APPS, QuotaUsageType.STATIC)
}
