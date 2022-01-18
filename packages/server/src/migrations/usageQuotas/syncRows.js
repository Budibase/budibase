const { getGlobalDB } = require("@budibase/backend-core/tenancy")
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

  // sync row count
  const usageDoc = await getUsageQuotaDoc(db)
  usageDoc.usageQuota.rows = rows.length
  await db.put(usageDoc)
}
