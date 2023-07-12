import {
  DocumentType,
  SEPARATOR,
  UNICODE_MAX,
  context,
} from "@budibase/backend-core"
import { ViewV2 } from "@budibase/types"
import * as utils from "../../../db/utils"

export async function fetch() {
  const db = context.getAppDB()

  const startKey = `${DocumentType.VIEW}${SEPARATOR}`
  const response = await db.allDocs({
    startkey: startKey,
    endkey: `${startKey}${UNICODE_MAX}`,
    include_docs: true,
  })

  return response.rows.map(r => r.doc)
}

export async function findByTable(tableId: string) {
  const db = context.getAppDB()

  const startKey = utils.viewIDPrefix(tableId)
  const response = await db.allDocs({
    startkey: startKey,
    endkey: `${startKey}${UNICODE_MAX}`,
    include_docs: true,
  })

  return response.rows.map(r => r.doc)
}

export async function get(viewId: string) {
  const db = context.getAppDB()
  const result = await db.get(viewId)
  return result
}

export async function save(view: ViewV2) {
  const db = context.getAppDB()

  const response = await db.put(
    {
      _id: utils.generateViewID(view.tableId),
      ...view,
    },
    {}
  )
  return {
    _id: response.id,
    _rev: response.rev,
  }
}

export async function remove(viewId: string, rev: string) {
  const db = context.getAppDB()
  await db.remove(viewId, rev)
}
