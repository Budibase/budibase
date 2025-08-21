import { FieldType, Table, Row } from "@budibase/types"
import { db as dbCore } from "@budibase/backend-core"
import { DocumentType, SEPARATOR } from "../../../db/utils"
import Nano from "@budibase/nano"

// default limit - seems to work well for performance
export const FIND_LIMIT = 25

function generateAttachmentFindParams(
  tableId: string,
  attachmentCols: string[],
  bookmark?: string
) {
  const params: Nano.MangoQuery = {
    selector: {
      $or: attachmentCols.map(col => ({ [col]: { $exists: true } })),
      _id: {
        $regex: `^${DocumentType.ROW}${SEPARATOR}${tableId}`,
      },
    },
    limit: FIND_LIMIT,
  }
  if (bookmark) {
    params.bookmark = bookmark
  }
  return params
}

export async function getRowsWithAttachments(appId: string, table: Table) {
  // iterate through attachment documents and update them
  const db = dbCore.getDB(appId)
  const attachmentCols: string[] = []
  for (let [key, column] of Object.entries(table.schema)) {
    if (
      column.type === FieldType.ATTACHMENTS ||
      column.type === FieldType.ATTACHMENT_SINGLE ||
      column.type === FieldType.SIGNATURE_SINGLE
    ) {
      attachmentCols.push(key)
    }
  }
  // no attachment columns, nothing to do
  if (attachmentCols.length === 0) {
    return { rows: [], columns: [] }
  }
  let bookmark: string | undefined = undefined,
    rowsLength = 0,
    rowList: Row[] = []
  do {
    const params = generateAttachmentFindParams(
      table._id!,
      attachmentCols,
      bookmark
    )
    // use the CouchDB Mango query API to lookup rows that have attachments
    const resp = await db.find<Row>(params)
    bookmark = resp.bookmark
    rowsLength = resp.docs.length
    const rows = resp.docs
    rowList = rowList.concat(rows)
  } while (rowsLength === FIND_LIMIT)
  // write back the updated attachments
  return { rows: rowList, columns: attachmentCols }
}
