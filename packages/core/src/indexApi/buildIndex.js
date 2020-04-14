import { filter, includes, some } from "lodash/fp"
import { getAllIdsIterator } from "../indexing/allIds"
import {
  getFlattenedHierarchy,
  getRecordNodeById,
  getNode,
  isIndex,
  isRecord,
  getActualKeyOfParent,
  getAllowedRecordNodesForIndex,
  fieldReversesReferenceToIndex,
  isTopLevelIndex,
} from "../templateApi/hierarchy"
import { joinKey, apiWrapper, events, $ } from "../common"
import {
  createBuildIndexFolder,
  transactionForBuildIndex,
} from "../transactions/create"
import { permission } from "../authApi/permissions"
import { BadRequestError } from "../common/errors"
import { initialiseIndex } from "../indexing/initialiseIndex"
import { getRecordInfo } from "../recordApi/recordInfo"

/** rebuilds an index
 * @param {object} app - the application container
 * @param {string} indexNodeKey - node key of the index, which the index belongs to
 */
export const buildIndex = app => async indexNodeKey =>
  apiWrapper(
    app,
    events.indexApi.buildIndex,
    permission.manageIndex.isAuthorized,
    { indexNodeKey },
    _buildIndex,
    app,
    indexNodeKey
  )

export const _buildIndex = async (app, indexNodeKey) => {
  const indexNode = getNode(app.hierarchy, indexNodeKey)

  await createBuildIndexFolder(app.datastore, indexNodeKey)

  if (!isIndex(indexNode)) {
    throw new BadRequestError("BuildIndex: must supply an indexnode")
  }

  if (indexNode.indexType === "reference") {
    await buildReverseReferenceIndex(app, indexNode)
  } else {
    await buildHeirarchalIndex(app, indexNode)
  }

  await app.cleanupTransactions()
}

const buildReverseReferenceIndex = async (app, indexNode) => {
  // Iterate through all referencING records,
  // and update referenced index for each record
  let recordCount = 0
  const referencingNodes = $(app.hierarchy, [
    getFlattenedHierarchy,
    filter(
      n =>
        isRecord(n) && some(fieldReversesReferenceToIndex(indexNode))(n.fields)
    ),
  ])

  const createTransactionsForReferencingNode = async referencingNode => {
    const iterateReferencingNodes = await getAllIdsIterator(app)(
      referencingNode.collectionNodeKey()
    )

    let referencingIdIterator = await iterateReferencingNodes()
    while (!referencingIdIterator.done) {
      const { result } = referencingIdIterator
      for (const id of result.ids) {
        const recordKey = joinKey(result.collectionKey, id)
        await transactionForBuildIndex(
          app,
          indexNode.nodeKey(),
          recordKey,
          recordCount
        )
        recordCount++
      }
      referencingIdIterator = await iterateReferencingNodes()
    }
  }

  for (const referencingNode of referencingNodes) {
    await createTransactionsForReferencingNode(referencingNode)
  }
}

const buildHeirarchalIndex = async (app, indexNode) => {
  let recordCount = 0

  const createTransactionsForIds = async (collectionKey, ids) => {
    for (const recordId of ids) {
      const recordKey = joinKey(collectionKey, recordId)

      const recordNode = getRecordNodeById(app.hierarchy, recordId)

      if (recordNodeApplies(indexNode)(recordNode)) {
        await transactionForBuildIndex(
          app,
          indexNode.nodeKey(),
          recordKey,
          recordCount
        )
        recordCount++
      }
    }
  }

  const collectionRecords = getAllowedRecordNodesForIndex(
    app.hierarchy,
    indexNode
  )

  for (const targetCollectionRecordNode of collectionRecords) {
    const allIdsIterator = await getAllIdsIterator(app)(
      targetCollectionRecordNode.collectionNodeKey()
    )

    let allIds = await allIdsIterator()
    while (allIds.done === false) {
      await createTransactionsForIds(
        allIds.result.collectionKey,
        allIds.result.ids
      )
      allIds = await allIdsIterator()
    }
  }

  return recordCount
}

const recordNodeApplies = indexNode => recordNode =>
  includes(recordNode.nodeId)(indexNode.allowedModelNodeIds)

export default buildIndex
