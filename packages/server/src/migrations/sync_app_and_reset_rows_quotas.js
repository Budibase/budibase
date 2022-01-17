const {
  MIGRATIONS,
  MIGRATION_DBS,
  migrateIfRequired,
} = require("@budibase/backend-core/migrations")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { getAllApps } = require("@budibase/backend-core/db")
const CouchDB = require("../db")
const { getUsageQuotaDoc, useQuotas } = require("../utilities/usageQuota")
const { getUniqueRows } = require("../utilities/usageQuota/rows")

const syncRowsQuota = async db => {
  // get all rows in all apps
  const allApps = await getAllApps(CouchDB, { all: true })
  const appIds = allApps ? allApps.map(app => app.appId) : []
  const rows = await getUniqueRows(appIds)

  // sync row count
  const usageDoc = await getUsageQuotaDoc(db)
  usageDoc.usageQuota.rows = rows.size
  await db.put(usageDoc)
}

const syncAppsQuota = async db => {
  // get app count
  const devApps = await getAllApps(CouchDB, { dev: true })
  const appCount = devApps ? devApps.length : 0

  // sync app count
  const usageDoc = await getUsageQuotaDoc(db)
  usageDoc.usageQuota.apps = appCount
  await db.put(usageDoc)
}

exports.runIfRequired = async () => {
  await migrateIfRequired(
    MIGRATION_DBS.GLOBAL_DB,
    MIGRATIONS.SYNC_APP_AND_RESET_ROWS_QUOTAS,
    async () => {
      if (!useQuotas()) {
        return
      }
      const db = getGlobalDB()
      await syncAppsQuota(db)
      await syncRowsQuota(db)
    }
  )
}
