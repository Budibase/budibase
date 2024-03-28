import { context } from "@budibase/backend-core"
import { allLinkDocs } from "../../db/utils"
import LinkDocumentImpl from "../../db/linkedRows/LinkDocument"

const migration = async () => {
  const linkDocs = await allLinkDocs()

  const docsToUpdate = []
  for (const linkDoc of linkDocs) {
    if (linkDoc.tableId) {
      // It already had the required data
      continue
    }

    linkDoc.tableId = new LinkDocumentImpl(
      linkDoc.doc1.tableId,
      linkDoc.doc1.fieldName,
      linkDoc.doc1.rowId,
      linkDoc.doc2.tableId,
      linkDoc.doc2.fieldName,
      linkDoc.doc2.rowId
    ).tableId
    docsToUpdate.push(linkDoc)
  }

  if (docsToUpdate.length) {
    const db = context.getAppDB()
    await db.bulkDocs(docsToUpdate)
  }
}

export default migration
