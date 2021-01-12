const PouchDB = require("../../../db")
const { DocumentTypes, SEPARATOR, UNICODE_MAX } = require("../../../db/utils")

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

  return {
    rows: existingRows,
    users: existingUsers,
    views: Object.keys(designDoc.views).length,
  }
}
