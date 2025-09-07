import { context, db as dbCore } from "@budibase/backend-core"
import { getTableIdFromViewId, isViewId } from "@budibase/shared-core"
import { Database, Row } from "@budibase/types"
import { getRowParams } from "../../../db/utils"
import { isExternalTableID } from "../../../integrations/utils"
import * as external from "./external"
import * as internal from "./internal"

export async function getAllInternalRows(appId?: string) {
  let db: Database
  if (appId) {
    db = dbCore.getDB(appId)
  } else {
    db = context.getWorkspaceDB()
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
  if (isViewId(tableOrViewId)) {
    tableId = getTableIdFromViewId(tableOrViewId)
  }

  if (isExternalTableID(tableId)) {
    return external
  }
  return internal
}

export async function save(
  sourceId: string,
  row: Row,
  userId: string | undefined,
  opts?: { updateAIColumns: boolean }
) {
  return pickApi(sourceId).save(sourceId, row, userId, opts)
}

export async function find(sourceId: string, rowId: string) {
  return pickApi(sourceId).find(sourceId, rowId)
}
