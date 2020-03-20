import { getAllIdsIterator } from "../indexing/allIds"
import { getCollectionDir } from "../recordApi/recordInfo"
import { isTopLevelRecord, getCollectionKey } from "./hierarchy"
import { safeKey, joinKey } from "../common"

export const deleteAllRecordsForNode = async (app, recordNode) => {

  if (isTopLevelRecord(recordNode)) {
    await deleteRecordCollection(
      app, recordNode.collectionName)
    return
  }

  const iterate = await getAllIdsIterator(app)(recordNode.parent().nodeKey())
  let iterateResult = await iterate()
  while (!iterateResult.done) {
    const { result } = iterateResult
    for (const id of result.ids) {
      const deletingCollectionKey = joinKey(
        result.collectionKey, id, recordNode.collectionName)
      await deleteRecordCollection(app, deletingCollectionKey)
    }
    iterateResult = await iterate()
  }

}

const deleteRecordCollection = async (app, collectionKey) => {
  collectionKey = safeKey(collectionKey)
  await app.datastore.deleteFolder(
    getCollectionDir(app.hierarchy, collectionKey))
}