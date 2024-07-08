import { context } from "@budibase/backend-core"
import { allLinkDocs } from "../../db/utils"
import LinkDocumentImpl from "../../db/linkedRows/LinkDocument"
import sdk from "../../sdk"
import env from "../../environment"

const migration = async () => {
  const linkDocs = await allLinkDocs()

  const docsToUpdate = []
  for (const linkDoc of linkDocs) {
    if (linkDoc.tableId) {
      // It already had the required data
      continue
    }

    // it already has the junction table ID - no need to migrate
    if (!linkDoc.tableId) {
      const newLink = new LinkDocumentImpl(
        linkDoc.doc1.tableId,
        linkDoc.doc1.fieldName,
        linkDoc.doc1.rowId,
        linkDoc.doc2.tableId,
        linkDoc.doc2.fieldName,
        linkDoc.doc2.rowId
      )
      newLink._id = linkDoc._id!
      newLink._rev = linkDoc._rev
      docsToUpdate.push(newLink)
    }
  }

  const db = context.getAppDB()
  if (docsToUpdate.length) {
    await db.bulkDocs(docsToUpdate)
  }

  // at the end make sure design doc is ready
  await sdk.tables.sqs.syncDefinition()
  // only do initial search if environment is using SQS already
  // initial search makes sure that all the indexes have been created
  // and are ready to use, avoiding any initial waits for large tables
  if (env.SQS_MIGRATION_ENABLE || env.SQS_SEARCH_ENABLE) {
    const tables = await sdk.tables.getAllInternalTables()
    // do these one by one - running in parallel could cause problems
    for (let table of tables) {
      await db.sql(`select * from ${table._id} limit 1`)
    }
  }
}

export default migration
