const {
  MIGRATIONS,
  MIGRATION_DBS,
  migrateIfRequired,
} = require("@budibase/backend-core/migrations")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { getAllApps } = require("@budibase/backend-core/db")
const CouchDB = require("../db")
const { getUsageQuotaDoc } = require("../utilities/usageQuota")

exports.runIfRequired = async () => {
  await migrateIfRequired(
    MIGRATION_DBS.GLOBAL_DB,
    MIGRATIONS.SYNC_APP_AND_RESET_ROWS_QUOTAS,
    async () => {
      const db = getGlobalDB()
      const usageDoc = await getUsageQuotaDoc(db)

      // reset the rows
      usageDoc.usageQuota.rows = 0

      // sync the apps
      const apps = await getAllApps(CouchDB, { dev: true })
      const appCount = apps ? apps.length : 0
      usageDoc.usageQuota.apps = appCount

      await db.put(usageDoc)
    }
  )
}
