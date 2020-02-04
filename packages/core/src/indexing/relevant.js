import { orderBy } from "lodash"
import {
  reduce,
  find,
  includes,
  flatten,
  union,
  filter,
  each,
  map,
} from "lodash/fp"
import {
  joinKey,
  splitKey,
  isNonEmptyString,
  isNothing,
  $,
  isSomething,
} from "../common"
import {
  getFlattenedHierarchy,
  getNode,
  getRecordNodeId,
  getExactNodeForKey,
  recordNodeIdIsAllowed,
  isRecord,
  isGlobalIndex,
} from "../templateApi/hierarchy"
import { indexTypes } from "../templateApi/indexes"
import { getIndexDir } from "../indexApi/getIndexDir"
import { getRecordInfo } from "../recordApi/recordInfo"

export const getRelevantAncestorIndexes = (hierarchy, record) => {
  const key = record.key
  const keyParts = splitKey(key)
  const nodeId = getRecordNodeId(key)

  const flatHierarchy = orderBy(
    getFlattenedHierarchy(hierarchy),
    [node => node.pathRegx().length],
    ["desc"]
  )

  const makeindexNodeAndDir_ForAncestorIndex = (indexNode, parentRecordDir) =>
    makeIndexNodeAndDir(indexNode, joinKey(parentRecordDir, indexNode.name))

  const traverseAncestorIndexesInPath = () =>
    reduce(
      (acc, part) => {
        const currentIndexKey = joinKey(acc.lastIndexKey, part)
        acc.lastIndexKey = currentIndexKey
        const testPathRegx = p =>
          new RegExp(`${p.pathRegx()}$`).test(currentIndexKey)
        const nodeMatch = find(testPathRegx)(flatHierarchy)

        if (isNothing(nodeMatch)) {
          return acc
        }

        if (!isRecord(nodeMatch) || nodeMatch.indexes.length === 0) {
          return acc
        }

        const indexes = $(nodeMatch.indexes, [
          filter(
            i =>
              i.indexType === indexTypes.ancestor &&
              (i.allowedRecordNodeIds.length === 0 ||
                includes(nodeId)(i.allowedRecordNodeIds))
          ),
        ])

        const currentRecordDir = getRecordInfo(hierarchy, currentIndexKey).dir

        each(v =>
          acc.nodesAndKeys.push(
            makeindexNodeAndDir_ForAncestorIndex(v, currentRecordDir)
          )
        )(indexes)

        return acc
      },
      { lastIndexKey: "", nodesAndKeys: [] }
    )(keyParts).nodesAndKeys

  const rootIndexes = $(flatHierarchy, [
    filter(n => isGlobalIndex(n) && recordNodeIdIsAllowed(n)(nodeId)),
    map(i => makeIndexNodeAndDir(i, getIndexDir(hierarchy, i.nodeKey()))),
  ])

  return union(traverseAncestorIndexesInPath())(rootIndexes)
}

export const getRelevantReverseReferenceIndexes = (hierarchy, record) =>
  $(record.key, [
    getExactNodeForKey(hierarchy),
    n => n.fields,
    filter(
      f =>
        f.type === "reference" &&
        isSomething(record[f.name]) &&
        isNonEmptyString(record[f.name].key)
    ),
    map(f =>
      $(f.typeOptions.reverseIndexNodeKeys, [
        map(n => ({
          recordNode: getNode(hierarchy, n),
          field: f,
        })),
      ])
    ),
    flatten,
    map(n =>
      makeIndexNodeAndDir(
        n.recordNode,
        joinKey(
          getRecordInfo(hierarchy, record[n.field.name].key).dir,
          n.recordNode.name
        )
      )
    ),
  ])

const makeIndexNodeAndDir = (indexNode, indexDir) => ({ indexNode, indexDir })

export default getRelevantAncestorIndexes
