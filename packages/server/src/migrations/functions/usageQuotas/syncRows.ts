const { getGlobalDB, getTenantId } = require("@budibase/backend-core/tenancy")
const { getAllApps } = require("@budibase/backend-core/db")
import CouchDB from "../../../db"
import { getUsageQuotaDoc } from "../../../utilities/usageQuota"
import { getUniqueRows } from "../../../utilities/usageQuota/rows"

export const run = async () => {
  const db = getGlobalDB()
  // get all rows in all apps
  const allApps = await getAllApps(CouchDB, { all: true })
  const appIds = allApps ? allApps.map((app: { appId: any }) => app.appId) : []
  const rows = await getUniqueRows(appIds)
  const rowCount = rows ? rows.length : 0

  // sync row count
  const tenantId = getTenantId()
  console.log(`[Tenant: ${tenantId}] Syncing row count: ${rowCount}`)
  const usageDoc = await getUsageQuotaDoc(db)
  usageDoc.usageQuota.rows = rowCount
  await db.put(usageDoc)
}
