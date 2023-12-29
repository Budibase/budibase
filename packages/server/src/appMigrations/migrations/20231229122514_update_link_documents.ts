import { SEPARATOR, context } from "@budibase/backend-core"
import { allLinkDocs } from "../../db/utils"

const migration = async () => {
  const linkDocs = await allLinkDocs()

  const docsToUpdate = []
  for (const linkDoc of linkDocs) {
    if (linkDoc.tableId) {
      // It already had the required data
      continue
    }

    linkDoc.tableId = [linkDoc.doc1.tableId, linkDoc.doc2.tableId]
      .sort()
      .join(SEPARATOR)
    docsToUpdate.push(linkDoc)
  }

  if (docsToUpdate.length) {
    const db = context.getAppDB()
    await db.bulkDocs(docsToUpdate)
  }
}

export default migration
