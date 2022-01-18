const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { getAllApps } = require("@budibase/backend-core/db")
const CouchDB = require("../../db")
const { getUsageQuotaDoc } = require("../../utilities/usageQuota")

exports.run = async () => {
  const db = getGlobalDB()
  // get app count
  const devApps = await getAllApps(CouchDB, { dev: true })
  const appCount = devApps ? devApps.length : 0

  // sync app count
  const usageDoc = await getUsageQuotaDoc(db)
  usageDoc.usageQuota.apps = appCount
  await db.put(usageDoc)
}
