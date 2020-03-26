import { isString, flatten, map, filter } from "lodash/fp"
import { initialiseChildCollections } from "../collectionApi/initialise"
import { _loadFromInfo } from "./load"
import { $, joinKey } from "../common"
import {
  getFlattenedHierarchy,
  isRecord,
  getNode,
  isTopLevelRecord,
  fieldReversesReferenceToNode,
} from "../templateApi/hierarchy"
import { initialiseIndex } from "../indexing/initialiseIndex"
import { getRecordInfo } from "./recordInfo"
import { getAllIdsIterator } from "../indexing/allIds"

export const initialiseChildren = async (app, recordInfoOrKey) => {
  const recordInfo = isString(recordInfoOrKey) 
        ?  getRecordInfo(app.hierarchy, recordInfoOrKey)
        : recordInfoOrKey
  await initialiseReverseReferenceIndexes(app, recordInfo)
  await initialiseAncestorIndexes(app, recordInfo)
  await initialiseChildCollections(app, recordInfo)
}

export const initialiseChildrenForNode = async (app, recordNode) => {

  if (isTopLevelRecord(recordNode)) {
    await initialiseChildren(
      app, recordNode.nodeKey())
    return
  }

  const iterate = await getAllIdsIterator(app)(recordNode.parent().collectionNodeKey())
  let iterateResult = await iterate()
  while (!iterateResult.done) {
    const { result } = iterateResult
    for (const id of result.ids) {
      const initialisingRecordKey = joinKey(
        result.collectionKey, id)
      await initialiseChildren(app, initialisingRecordKey)
    }
    iterateResult = await iterate()
  }
}

const initialiseAncestorIndexes = async (app, recordInfo) => {
  for (const index of recordInfo.recordNode.indexes) {
    const indexKey = recordInfo.child(index.name)
    if (!(await app.datastore.exists(indexKey))) {
      await initialiseIndex(app.datastore, recordInfo.dir, index)
    }
  }
}

const initialiseReverseReferenceIndexes = async (app, recordInfo) => {
  const indexNodes = $(
    fieldsThatReferenceThisRecord(app, recordInfo.recordNode),
    [
      map(f =>
        $(f.typeOptions.reverseIndexNodeKeys, [
          map(n => getNode(app.hierarchy, n)),
        ])
      ),
      flatten,
    ]
  )

  for (const indexNode of indexNodes) {
    await initialiseIndex(app.datastore, recordInfo.dir, indexNode)
  }
}

const fieldsThatReferenceThisRecord = (app, recordNode) =>
  $(app.hierarchy, [
    getFlattenedHierarchy,
    filter(isRecord),
    map(n => n.fields),
    flatten,
    filter(fieldReversesReferenceToNode(recordNode)),
  ])


