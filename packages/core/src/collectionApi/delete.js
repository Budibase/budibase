import { safeKey, apiWrapper, events, joinKey } from "../common"
import { _deleteRecord } from "../recordApi/delete"
import { getAllIdsIterator } from "../indexing/allIds"
import { permission } from "../authApi/permissions"
import { getCollectionDir } from "../recordApi/recordInfo"

export const deleteCollection = (app, disableCleanup = false) => async key =>
  apiWrapper(
    app,
    events.collectionApi.delete,
    permission.manageCollection.isAuthorized,
    { key },
    _deleteCollection,
    app,
    key,
    disableCleanup
  )

/*
  const recordNode = getCollectionNode(app.hierarchy, key);

*/

export const _deleteCollection = async (app, key, disableCleanup) => {
  key = safeKey(key)
  const collectionDir = getCollectionDir(app.hierarchy, key)
  await deleteRecords(app, key)
  await deleteCollectionFolder(app, collectionDir)
  if (!disableCleanup) {
    await app.cleanupTransactions()
  }
}

const deleteCollectionFolder = async (app, dir) =>
  await app.datastore.deleteFolder(dir)

const deleteRecords = async (app, key) => {
  const iterate = await getAllIdsIterator(app)(key)

  let ids = await iterate()
  while (!ids.done) {
    if (ids.result.collectionKey === key) {
      for (const id of ids.result.ids) {
        await _deleteRecord(app, joinKey(key, id), true)
      }
    }

    ids = await iterate()
  }
}
