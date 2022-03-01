const { getAppDB } = require("@budibase/backend-core/context")
import { isExternalTable } from "../../../integrations/utils"

export async function addRev(
  body: { _id?: string; _rev?: string },
  tableId?: string
) {
  if (!body._id || (tableId && isExternalTable(tableId))) {
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
export function search(docs: any[], value: any, key = "name") {
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
