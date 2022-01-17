const { getRowParams, USER_METDATA_PREFIX } = require("../../db/utils")
const CouchDB = require("../../db")

const ROW_EXCLUSIONS = [USER_METDATA_PREFIX]

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
      allRows.push(
        ...response.rows
          .map(r => r.id)
          .filter(id => {
            for (let exclusion of ROW_EXCLUSIONS) {
              if (id.startsWith(exclusion)) {
                return false
              }
            }
            return true
          })
      )
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
exports.getUniqueRows = async appIds => {
  const allRows = await getAllRows(appIds)
  return new Set(allRows)
}
