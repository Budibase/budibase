import { context } from "@budibase/backend-core"
import { isExternalTable } from "../../../integrations/utils"
import { APP_PREFIX, DocumentType } from "../../../db/utils"

export async function addRev(
  body: { _id?: string; _rev?: string },
  tableId?: string
) {
  if (!body._id || (tableId && isExternalTable(tableId))) {
    return body
  }
  let id = body._id
  if (body._id.startsWith(APP_PREFIX)) {
    id = DocumentType.APP_METADATA
  }
  const db = context.getAppDB()
  const dbDoc = await db.get<any>(id)
  body._rev = dbDoc._rev
  // update ID in case it is an app ID
  body._id = id
  return body
}

/**
 * Performs a case in-sensitive search on the provided documents, using the
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
