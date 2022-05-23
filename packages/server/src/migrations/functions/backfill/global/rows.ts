import { events, db } from "@budibase/backend-core"
import { Row } from "@budibase/types"
import { getUniqueRows } from "../../../../utilities/usageQuota/rows"

// Rows is a special circumstance where we get rows across all apps
// therefore migration is performed at the global level

export const backfill = async () => {
  const allApps = await db.getAllApps({ all: true })
  const appIds = allApps ? allApps.map((app: { appId: any }) => app.appId) : []
  const rows: Row[] = await getUniqueRows(appIds)
  const rowCount = rows ? rows.length : 0
  if (rowCount) {
    await events.rows.created(rowCount)
  }
}
