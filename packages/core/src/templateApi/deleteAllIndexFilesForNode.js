import { getAllIdsIterator } from "../indexing/allIds"
import { getRecordInfo } from "../recordApi/recordInfo"
import { isTopLevelIndex, getParentKey, getLastPartInKey } from "./hierarchy"
import { safeKey, joinKey } from "../common"

export const deleteAllIndexFilesForNode = async (app, indexNode) => {
  if (isTopLevelIndex(indexNode)) {
    await app.datastore.deleteFolder(indexNode.nodeKey())
    return
  }

  const iterate = await getAllIdsIterator(app)(indexNode.parent().nodeKey())
  let iterateResult = await iterate()
  while (!iterateResult.done) {
    const { result } = iterateResult
    for (const id of result.ids) {
      const deletingIndexKey = joinKey(result.collectionKey, id, indexNode.name)
      await deleteIndexFolder(app, deletingIndexKey)
    }
    iterateResult = await iterate()
  }
}

const deleteIndexFolder = async (app, indexKey) => {
  indexKey = safeKey(indexKey)
  const indexName = getLastPartInKey(indexKey)
  const parentRecordKey = getParentKey(indexKey)
  const recordInfo = getRecordInfo(app.hierarchy, parentRecordKey)
  await app.datastore.deleteFolder(joinKey(recordInfo.dir, indexName))
}
