const {
  MIGRATIONS,
  MIGRATION_DBS,
  migrateIfRequired,
} = require("@budibase/backend-core/migrations")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { getAllApps } = require("@budibase/backend-core/db")
const CouchDB = require("../db")
const { getUsageQuotaDoc, useQuotas } = require("../utilities/usageQuota")
const { getRowParams } = require("../db/utils")

/**
 * Get all rows in the given app ids.
 *
 * The returned rows may contan duplicates if there
 * is a production and dev app.
 */
const getAllRows = async appIds => {
  const allRows = []
  let appDb
  for (let appId of appIds) {
    try {
      appDb = new CouchDB(appId)
      const response = await appDb.allDocs(
        getRowParams(null, null, {
          include_docs: false,
        })
      )
      allRows.push(...response.rows.map(r => r.id))
    } catch (e) {
      // don't error out if we can't count the app rows, just continue
    }
  }

  return allRows
}

/**
 * Get all rows in the given app ids.
 *
 * The returned rows will be unique, duplicated rows across
 * production and dev apps will be removed.
 */
const getUniqueRows = async appIds => {
  const allRows = await getAllRows(appIds)
  return new Set(allRows)
}

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
