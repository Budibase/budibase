const { getAppDB } = require("@budibase/backend-core/context")
const { isExternalTable } = require("../../../integrations/utils")

exports.addRev = async (body, tableId) => {
  if (!body._id || isExternalTable(tableId)) {
    return body
  }
  const db = getAppDB()
  const dbDoc = await db.get(body._id)
  body._rev = dbDoc._rev
  return body
}

/**
 * Performs a case insensitive search on the provided documents, using the
 * provided key and value. This will be a string based search, using the
 * startsWith function.
 */
exports.search = (docs, value, key = "name") => {
  if (!value || typeof value !== "string") {
    return docs
  }
  value = value.toLowerCase()
  const filtered = []
  for (let doc of docs) {
    if (typeof doc[key] !== "string") {
      continue
    }
    const toTest = doc[key].toLowerCase()
    if (toTest.startsWith(value)) {
      filtered.push(doc)
    }
  }
  return filtered
}
