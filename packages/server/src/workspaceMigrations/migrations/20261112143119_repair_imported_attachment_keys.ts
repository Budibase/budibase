import { context, db as dbCore, objectStore } from "@budibase/backend-core"
import type { Row, RowAttachment } from "@budibase/types"
import sdk from "../../sdk"
import { isWorkspaceAttachmentKey } from "../../utilities/rowProcessor/attachmentKey"

const migration = async () => {
  const db = context.getWorkspaceDB()
  const prodId = dbCore.getProdWorkspaceID(db.name)
  const tables = await sdk.tables.getAllInternalTables()
  for (const table of tables) {
    const { rows, columns } = await sdk.rows.getRowsWithAttachments(
      db.name,
      table
    )
    const updated: Row[] = []
    for (const row of rows) {
      let changed = false
      for (const column of columns) {
        const value = row[column]
        const attachments: RowAttachment[] = Array.isArray(value)
          ? value
          : [value]
        for (const attachment of attachments) {
          if (!attachment?.key || isWorkspaceAttachmentKey(attachment.key)) {
            continue
          }
          const key = `${prodId}${attachment.key.slice(attachment.key.indexOf("/"))}`
          if (
            isWorkspaceAttachmentKey(key) &&
            (await objectStore.objectExists(
              objectStore.ObjectStoreBuckets.APPS,
              key
            ))
          ) {
            attachment.key = key
            delete attachment.url
            changed = true
          }
        }
      }
      if (changed) {
        updated.push(row)
      }
    }
    if (updated.length) {
      const results = await db.bulkDocs(updated)
      if (results.some(result => result.error)) {
        throw new Error("Failed to repair imported attachment keys")
      }
    }
  }
}

export default migration
