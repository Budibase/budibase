import { events, db as dbUtils } from "@budibase/backend-core"
import { Row, App } from "@budibase/types"
import { getUniqueRows } from "../../../../utilities/usageQuota/rows"

// Rows is a special circumstance where we get rows across all apps
// therefore migration is performed at the global level

const getOldestCreatedAt = (allApps: App[]): string | undefined => {
  const timestamps = allApps
    .filter(app => !!app.createdAt)
    .map(app => app.createdAt as string)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  if (timestamps.length) {
    return timestamps[0]
  }
}

export const backfill = async () => {
  const allApps: App[] = await dbUtils.getAllApps({ dev: true })
  const timestamp = getOldestCreatedAt(allApps)
  const appIds = allApps ? allApps.map((app: { appId: any }) => app.appId) : []
  const rows: Row[] = await getUniqueRows(appIds)
  const rowCount = rows ? rows.length : 0
  if (rowCount) {
    await events.rows.created(rowCount, timestamp)
  }
}
