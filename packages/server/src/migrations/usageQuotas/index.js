const {
  MIGRATIONS,
  MIGRATION_DBS,
  migrateIfRequired,
} = require("@budibase/backend-core/migrations")
const { useQuotas } = require("../../utilities/usageQuota")
const syncApps = require("./syncApps")
const syncRows = require("./syncRows")

exports.run = async () => {
  if (!useQuotas()) {
    return
  }

  // Jan 2022
  await migrateIfRequired(
    MIGRATION_DBS.GLOBAL_DB,
    MIGRATIONS.QUOTAS_1,
    async () => {
      await syncApps.run()
      await syncRows.run()
    }
  )
}
