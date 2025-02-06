import { db as dbCore, context, docIds } from "@budibase/backend-core"
import { Database, Row } from "@budibase/types"
import { extractViewInfoFromID, getRowParams } from "../../../db/utils"
import { isExternalTableID } from "../../../integrations/utils"
import * as internal from "./internal"
import * as external from "./external"

export async function getAllInternalRows(appId?: string) {
  let db: Database
  if (appId) {
    db = dbCore.getDB(appId)
  } else {
    db = context.getAppDB()
  }
  const response = await db.allDocs(
    getRowParams(null, null, {
      include_docs: true,
    })
  )
  return response.rows.map(row => row.doc) as Row[]
}

function pickApi(tableOrViewId: string) {
  let tableId = tableOrViewId
  if (docIds.isViewId(tableOrViewId)) {
    tableId = extractViewInfoFromID(tableOrViewId).tableId
  }

  if (isExternalTableID(tableId)) {
    return external
  }
  return internal
}

export async function save(
  sourceId: string,
  row: Row,
  userId: string | undefined
) {
  return pickApi(sourceId).save(sourceId, row, userId)
}

export async function find(sourceId: string, rowId: string) {
  return pickApi(sourceId).find(sourceId, rowId)
}
