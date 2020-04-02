import {
  filter,
  map,
  reduce,
  isUndefined,
  includes,
  flatten,
  intersectionBy,
  isEqual,
  pull,
  keys,
  differenceBy,
  difference,
  some,
} from "lodash/fp"
import { union } from "lodash"
import {
  getRelevantAncestorIndexes,
  getRelevantReverseReferenceIndexes,
} from "../indexing/relevant"
import { evaluate } from "../indexing/evaluate"
import {
  $,
  isSomething,
  isNonEmptyArray,
  joinKey,
  isNonEmptyString,
} from "../common"
import { getIndexedDataKey } from "../indexing/sharding"
import {
  isUpdate,
  isCreate,
  isDelete,
  isBuildIndex,
} from "./transactionsCommon"
import { applyToShard } from "../indexing/apply"
import {
  getActualKeyOfParent,
  isGlobalIndex,
  fieldReversesReferenceToIndex,
  isReferenceIndex,
  getExactNodeForKey,
  getParentKey,
} from "../templateApi/hierarchy"
import { getRecordInfo } from "../recordApi/recordInfo"
import { getIndexDir } from "../indexApi/getIndexDir"
import { _deleteIndex } from "../indexApi/delete"
import { initialiseIndex } from "../indexing/initialiseIndex"

export const executeTransactions = app => async transactions => {
  const recordsByShard = mappedRecordsByIndexShard(app.hierarchy, transactions)

  for (const shard of keys(recordsByShard)) {
    if (recordsByShard[shard].isRebuild) {
      if (await app.datastore.exists(shard))
        await app.datastore.deleteFile(shard)
      await initialiseIndex(
        app.datastore,
        getParentKey(recordsByShard[shard].indexDir),
        recordsByShard[shard].indexNode
      )
    }
    await applyToShard(
      app.hierarchy,
      app.datastore,
      recordsByShard[shard].indexDir,
      recordsByShard[shard].indexNode,
      shard,
      recordsByShard[shard].writes,
      recordsByShard[shard].removes
    )
  }
}

const mappedRecordsByIndexShard = (hierarchy, transactions) => {
  const updates = getUpdateTransactionsByShard(hierarchy, transactions)

  const created = getCreateTransactionsByShard(hierarchy, transactions)
  const deletes = getDeleteTransactionsByShard(hierarchy, transactions)

  const indexBuild = getBuildIndexTransactionsByShard(hierarchy, transactions)

  const toRemove = [
    ...deletes, 
    ...updates.toRemove, 
    ...indexBuild.toRemove,
  ]

  const toWrite = [...created, ...updates.toWrite, ...indexBuild.toWrite]

  const transByShard = {}

  const initialiseShard = t => {
    if (isUndefined(transByShard[t.indexShardKey])) {
      transByShard[t.indexShardKey] = {
        writes: [],
        removes: [],
        isRebuild:
          some(i => i.indexShardKey === t.indexShardKey)(indexBuild.toWrite) ||
          some(i => i.indexShardKey === t.indexShardKey)(indexBuild.toRemove),
        indexDir: t.indexDir,
        indexNodeKey: t.indexNode.nodeKey(),
        indexNode: t.indexNode,
      }
    }
  }

  for (const trans of toWrite) {
    initialiseShard(trans)
    transByShard[trans.indexShardKey].writes.push(trans.mappedRecord.result)
  }

  for (const trans of toRemove) {
    initialiseShard(trans)
    transByShard[trans.indexShardKey].removes.push(
      trans.mappedRecord.result.key
    )
  }

  return transByShard
}

const getUpdateTransactionsByShard = (hierarchy, transactions) => {
  const updateTransactions = $(transactions, [filter(isUpdate)])

  const evaluateIndex = (record, indexNodeAndPath) => {
    const mappedRecord = evaluate(record)(indexNodeAndPath.indexNode)
    return {
      mappedRecord,
      indexNode: indexNodeAndPath.indexNode,
      indexDir: indexNodeAndPath.indexDir,
      indexShardKey: getIndexedDataKey(
        indexNodeAndPath.indexNode,
        indexNodeAndPath.indexDir,
        mappedRecord.result
      ),
    }
  }

  const getIndexNodesToApply = indexFilter => (t, indexes) =>
    $(indexes, [
      map(n => ({
        old: evaluateIndex(t.oldRecord, n),
        new: evaluateIndex(t.record, n),
      })),
      filter(indexFilter),
    ])

  const toRemoveFilter = (n, isUnreferenced) =>
    n.old.mappedRecord.passedFilter === true &&
    (n.new.mappedRecord.passedFilter === false || isUnreferenced)

  const toAddFilter = (n, isNewlyReferenced) =>
    (n.old.mappedRecord.passedFilter === false || isNewlyReferenced) &&
    n.new.mappedRecord.passedFilter === true

  const toUpdateFilter = n =>
    n.new.mappedRecord.passedFilter === true &&
    n.old.mappedRecord.passedFilter === true &&
    !isEqual(n.old.mappedRecord.result, n.new.mappedRecord.result)

  const toRemove = []
  const toWrite = []

  for (const t of updateTransactions) {
    const ancestorIdxs = getRelevantAncestorIndexes(hierarchy, t.record)

    const referenceChanges = diffReverseRefForUpdate(
      hierarchy,
      t.oldRecord,
      t.record
    )

    // old records to remove (filtered out)
    const filteredOut_toRemove = union(
      getIndexNodesToApply(toRemoveFilter)(t, ancestorIdxs),
      // still referenced - check filter
      getIndexNodesToApply(toRemoveFilter)(t, referenceChanges.notChanged),
      // un referenced - remove if in there already
      getIndexNodesToApply(n => toRemoveFilter(n, true))(
        t,
        referenceChanges.unReferenced
      )
    )

    // new records to add (filtered in)
    const filteredIn_toAdd = union(
      getIndexNodesToApply(toAddFilter)(t, ancestorIdxs),
      // newly referenced - check filter
      getIndexNodesToApply(n => toAddFilter(n, true))(
        t,
        referenceChanges.newlyReferenced
      ),
      // reference unchanged - rerun filter in case something else changed
      getIndexNodesToApply(toAddFilter)(t, referenceChanges.notChanged)
    )

    const changed = union(
      getIndexNodesToApply(toUpdateFilter)(t, ancestorIdxs),
      // still referenced - recheck filter
      getIndexNodesToApply(toUpdateFilter)(t, referenceChanges.notChanged)
    )

    const shardKeyChanged = $(changed, [
      filter(c => c.old.indexShardKey !== c.new.indexShardKey),
    ])

    const changedInSameShard = $(shardKeyChanged, [difference(changed)])

    for (const res of shardKeyChanged) {
      pull(res)(changed)
      filteredOut_toRemove.push(res)
      filteredIn_toAdd.push(res)
    }

    toRemove.push($(filteredOut_toRemove, [map(i => i.old)]))

    toWrite.push($(filteredIn_toAdd, [map(i => i.new)]))

    toWrite.push($(changedInSameShard, [map(i => i.new)]))
  }

  return {
    toRemove: flatten(toRemove),
    toWrite: flatten(toWrite),
  }
}

const getBuildIndexTransactionsByShard = (hierarchy, transactions) => {
  const buildTransactions = $(transactions, [filter(isBuildIndex)])
  if (!isNonEmptyArray(buildTransactions)) return { toWrite: [], toRemove: [] }
  const indexNode = transactions.indexNode

  const getIndexDirs = t => {
    if (isGlobalIndex(indexNode)) {
      return [indexNode.nodeKey()]
    }

    if (isReferenceIndex(indexNode)) {
      const recordNode = getExactNodeForKey(hierarchy)(t.record.key)
      const refFields = $(recordNode.fields, [
        filter(fieldReversesReferenceToIndex(indexNode)),
      ])
      const indexDirs = []
      for (const refField of refFields) {
        const refValue = t.record[refField.name]
        if (isSomething(refValue) && isNonEmptyString(refValue.key)) {
          const indexDir = joinKey(
            getRecordInfo(hierarchy, refValue.key).dir,
            indexNode.name
          )

          if (!includes(indexDir)(indexDirs)) {
            indexDirs.push(indexDir)
          }
        }
      }
      return indexDirs
    }

    const indexKey = joinKey(
      getActualKeyOfParent(indexNode.parent().nodeKey(), t.record.key),
      indexNode.name
    )

    return [getIndexDir(hierarchy, indexKey)]
  }

  return $(buildTransactions, [
    map(t => {
      const mappedRecord = evaluate(t.record)(indexNode)
      mappedRecord.result = mappedRecord.result || t.record
      const indexDirs = getIndexDirs(t)
      return $(indexDirs, [
        map(indexDir => ({
          mappedRecord,
          indexNode,
          indexDir,
          indexShardKey: getIndexedDataKey(
            indexNode,
            indexDir,
            mappedRecord.result
          ),
        })),
      ])
    }),
    flatten,
    reduce(
      (obj, res) => {
        if (res.mappedRecord.passedFilter) obj.toWrite.push(res)
        else obj.toRemove.push(res)
        return obj
      },
      { toWrite: [], toRemove: [] }
    ),
  ])
}

const get_Create_Delete_TransactionsByShard = pred => (
  hierarchy,
  transactions
) => {
  const createTransactions = $(transactions, [filter(pred)])

  const getIndexNodesToApply = (t, indexes) =>
    $(indexes, [
      map(n => {
        const mappedRecord = evaluate(t.record)(n.indexNode)
        return {
          mappedRecord,
          indexNode: n.indexNode,
          indexDir: n.indexDir,
          indexShardKey: getIndexedDataKey(
            n.indexNode,
            n.indexDir,
            mappedRecord.result
          ),
        }
      }),
      filter(n => n.mappedRecord.passedFilter),
    ])

  const allToApply = []

  for (const t of createTransactions) {
    const ancestorIdxs = getRelevantAncestorIndexes(hierarchy, t.record)
    const reverseRef = getRelevantReverseReferenceIndexes(hierarchy, t.record)

    allToApply.push(getIndexNodesToApply(t, ancestorIdxs))
    allToApply.push(getIndexNodesToApply(t, reverseRef))
  }

  return flatten(allToApply)
}

const getDeleteTransactionsByShard = get_Create_Delete_TransactionsByShard(
  isDelete
)

const getCreateTransactionsByShard = get_Create_Delete_TransactionsByShard(
  isCreate
)

const diffReverseRefForUpdate = (appHierarchy, oldRecord, newRecord) => {
  const oldIndexes = getRelevantReverseReferenceIndexes(appHierarchy, oldRecord)
  const newIndexes = getRelevantReverseReferenceIndexes(appHierarchy, newRecord)

  const unReferenced = differenceBy(i => i.indexDir, oldIndexes, newIndexes)

  const newlyReferenced = differenceBy(i => i.indexDir, newIndexes, oldIndexes)

  const notChanged = intersectionBy(i => i.indexDir, newIndexes, oldIndexes)

  return {
    unReferenced,
    newlyReferenced,
    notChanged,
  }
}
