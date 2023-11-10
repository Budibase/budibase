import { db as dbCore } from "@budibase/backend-core"
import { getUniqueRows } from "../../../utilities/usageQuota/rows"
import { quotas } from "@budibase/pro"
import { StaticQuotaName, QuotaUsageType, App } from "@budibase/types"

export const run = async () => {
  // get all rows in all apps
  const allApps = (await dbCore.getAllApps({ all: true })) as App[]
  const appIds = allApps ? allApps.map((app: { appId: any }) => app.appId) : []
  const { appRows } = await getUniqueRows(appIds)

  // get the counts per app
  const counts: { [key: string]: number } = {}
  let rowCount = 0
  Object.entries(appRows).forEach(([appId, rows]) => {
    counts[appId] = rows.length
    rowCount += rows.length
  })

  // sync row count
  console.log(`Syncing row count: ${rowCount}`)
  await quotas.setUsagePerApp(
    counts,
    StaticQuotaName.ROWS,
    QuotaUsageType.STATIC
  )
}
