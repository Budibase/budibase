const { getAppDB } = require("@budibase/backend-core/context")
const { getDocParams } = require("@budibase/backend-core/db")

exports.addRev = async body => {
  if (!body._id) {
    return body
  }
  const db = getAppDB()
  const dbDoc = await db.get(body._id)
  body._rev = dbDoc._rev
  return body
}

exports.search = (docs, key, value) => {
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

/**
 * Performs a case insensitive search on a document type, using the
 * provided key and value. This will be a string based search,
 * using the startsWith function.
 */
exports.searchDocs = async (docType, key, value) => {
  const db = getAppDB()
  const docs = (
    await db.allDocs(
      getDocParams(docType, null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
  return exports.search(docs, key, value)
}
