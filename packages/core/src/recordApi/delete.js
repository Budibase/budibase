import { safeKey, apiWrapper, events, joinKey } from "../common"
import { _load } from "./load"
import { _deleteCollection } from "../collectionApi/delete"
import { getExactNodeForKey } from "../templateApi/hierarchy"
import { transactionForDeleteRecord } from "../transactions/create"
import { permission } from "../authApi/permissions"
import { getRecordInfo } from "./recordInfo"

export const deleteRecord = (app, disableCleanup = false) => async key => {
  key = safeKey(key)
  return apiWrapper(
    app,
    events.recordApi.delete,
    permission.deleteRecord.isAuthorized(key),
    { key },
    _deleteRecord,
    app,
    key,
    disableCleanup
  )
}

// called deleteRecord because delete is a keyword
export const _deleteRecord = async (app, key) => {
  const recordInfo = getRecordInfo(app.hierarchy, key)
  key = recordInfo.key
  const node = getExactNodeForKey(app.hierarchy)(key)

  for (const collectionRecord of node.children) {
    const collectionKey = joinKey(key, collectionRecord.collectionName)
    await _deleteCollection(app, collectionKey, true)
  }

  await app.datastore.deleteFile(key)
}
