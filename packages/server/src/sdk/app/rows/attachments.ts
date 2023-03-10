import { CouchFindOptions, Table, Row } from "@budibase/types"
import { db as dbCore } from "@budibase/backend-core"
import { DocumentType, SEPARATOR } from "../../../db/utils"
import { FieldTypes } from "../../../constants"

// default limit - seems to work well for performance
export const FIND_LIMIT = 25

function generateAttachmentFindParams(
  tableId: string,
  attachmentCols: string[],
  bookmark: null | string
) {
  const params: CouchFindOptions = {
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
    if (column.type === FieldTypes.ATTACHMENT) {
      attachmentCols.push(key)
    }
  }
  // no attachment columns, nothing to do
  if (attachmentCols.length === 0) {
    return { rows: [], columns: [] }
  }
  let bookmark: null | string = null,
    rowsLength = 0,
    rowList: Row[] = []
  do {
    const params = generateAttachmentFindParams(
      table._id!,
      attachmentCols,
      bookmark
    )
    // use the CouchDB Mango query API to lookup rows that have attachments
    const resp = await dbCore.directCouchFind(db.name, params)
    bookmark = resp.bookmark
    rowsLength = resp.rows.length
    const rows = resp.rows
    rowList = rowList.concat(rows)
  } while (rowsLength === FIND_LIMIT)
  // write back the updated attachments
  return { rows: rowList, columns: attachmentCols }
}
