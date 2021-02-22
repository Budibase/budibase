const PouchDB = require("../../../db")
const {
  DocumentTypes,
  SEPARATOR,
  UNICODE_MAX,
  ViewNames,
} = require("../../../db/utils")

const EXCLUDED_VIEWS = [ViewNames.USERS, ViewNames.LINK, ViewNames.ROUTING]

exports.getAppQuota = async function(appId) {
  const db = new PouchDB(appId)

  const rows = await db.allDocs({
    startkey: DocumentTypes.ROW + SEPARATOR,
    endkey: DocumentTypes.ROW + SEPARATOR + UNICODE_MAX,
  })

  const users = await db.allDocs({
    startkey: DocumentTypes.USER + SEPARATOR,
    endkey: DocumentTypes.USER + SEPARATOR + UNICODE_MAX,
  })

  const existingRows = rows.rows.length
  const existingUsers = users.rows.length

  const designDoc = await db.get("_design/database")

  let views = 0
  for (let viewName of Object.keys(designDoc.views)) {
    if (EXCLUDED_VIEWS.indexOf(viewName) === -1) {
      views++
    }
  }

  return {
    rows: existingRows,
    users: existingUsers,
    views: views,
  }
}
