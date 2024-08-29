import { db as dbCore, context } from "@budibase/backend-core"
import { Database, Row } from "@budibase/types"
import {
  extractViewInfoFromID,
  getRowParams,
  isViewID,
} from "../../../db/utils"
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
  if (isViewID(tableOrViewId)) {
    tableId = extractViewInfoFromID(tableOrViewId).tableId
  }

  if (isExternalTableID(tableId)) {
    return external
  }
  return internal
}

export async function save(
  tableOrViewId: string,
  row: Row,
  userId: string | undefined
) {
  return pickApi(tableOrViewId).save(tableOrViewId, row, userId)
}

export async function find(tableOrViewId: string, rowId: string) {
  return pickApi(tableOrViewId).find(tableOrViewId, rowId)
}
