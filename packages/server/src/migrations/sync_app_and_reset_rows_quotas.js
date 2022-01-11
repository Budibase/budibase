const { MIGRATIONS, MIGRATION_DBS, migrateIfRequired } =
  require("@budibase/auth").migrations
const { getGlobalDB } = require("@budibase/auth/tenancy")
const { getUsageQuotaDoc } = require("../utilities/usageQuota")
const { getAllApps } = require("@budibase/auth/db")
const CouchDB = require("../db")

exports.migrate = async () => {
  await migrateIfRequired(
    MIGRATION_DBS.GLOBAL_DB,
    MIGRATIONS.SYNC_APP_AND_RESET_ROWS_QUOTAS,
    async () => {
      const globalDb = getGlobalDB()
      const usageDoc = await getUsageQuotaDoc(globalDb)

      // reset the rows
      usageDoc.usageQuota.rows = 0

      // sync the apps
      const apps = await getAllApps(CouchDB, { dev: true })
      const appCount = apps ? apps.length : 0
      usageDoc.usageQuota.apps = appCount

      await globalDb.put(usageDoc)
    }
  )
}
