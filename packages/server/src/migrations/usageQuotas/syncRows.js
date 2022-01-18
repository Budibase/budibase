const { getGlobalDB, getTenantId } = require("@budibase/backend-core/tenancy")
const { getAllApps } = require("@budibase/backend-core/db")
const CouchDB = require("../../db")
const { getUsageQuotaDoc } = require("../../utilities/usageQuota")
const { getUniqueRows } = require("../../utilities/usageQuota/rows")

exports.run = async () => {
  const db = getGlobalDB()
  // get all rows in all apps
  const allApps = await getAllApps(CouchDB, { all: true })
  const appIds = allApps ? allApps.map(app => app.appId) : []
  const rows = await getUniqueRows(appIds)
  const rowCount = rows ? rows.length : 0

  // sync row count
  const tenantId = getTenantId()
  console.log(`[Tenant: ${tenantId}] Syncing row count: ${rowCount}`)
  const usageDoc = await getUsageQuotaDoc(db)
  usageDoc.usageQuota.rows = rowCount
  await db.put(usageDoc)
}
