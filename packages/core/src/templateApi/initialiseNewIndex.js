import { getAllIdsIterator } from "../indexing/allIds"
import { getRecordInfo } from "../recordApi/recordInfo"
import { isTopLevelIndex } from "./hierarchy"
import { joinKey } from "../common"
import { initialiseIndex } from "../indexing/initialiseIndex"

export const initialiseNewIndex = async (app, indexNode) => {
  if (isTopLevelIndex(indexNode)) {
    await initialiseIndex(app.datastore, "/", indexNode)
    return
  }

  const iterate = await getAllIdsIterator(app)(indexNode.parent().nodeKey())
  let iterateResult = await iterate()
  while (!iterateResult.done) {
    const { result } = iterateResult
    for (const id of result.ids) {
      const recordKey = joinKey(result.collectionKey, id)
      await initialiseIndex(
        app.datastore,
        getRecordInfo(app.hierarchy, recordKey).dir,
        indexNode
      )
    }
    iterateResult = await iterate()
  }
}
