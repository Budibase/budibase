import { flatten, orderBy, filter, isUndefined } from "lodash/fp"
import {
  getFlattenedHierarchy,
  getCollectionNodeByKeyOrNodeKey,
  getNodeByKeyOrNodeKey,
  isCollectionRecord,
  isAncestor,
} from "../templateApi/hierarchy"
import { joinKey, safeKey, $ } from "../common"
import { getCollectionDir } from "../recordApi/recordInfo"

export const RECORDS_PER_FOLDER = 1000
export const allIdChars =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-"

// this should never be changed - ever
// - existing databases depend on the order of chars this string

/**
 * folderStructureArray should return an array like
 * - [1] = all records fit into one folder
 * - [2] = all records fite into 2 folders
 * - [64, 3] = all records fit into 64 * 3 folders
 * - [64, 64, 10] = all records fit into 64 * 64 * 10 folder
 * (there are 64 possible chars in allIsChars)
 */
export const folderStructureArray = recordNode => {
  const totalFolders = Math.ceil(recordNode.estimatedRecordCount / 1000)
  const folderArray = []
  let levelCount = 1
  while (64 ** levelCount < totalFolders) {
    levelCount += 1
    folderArray.push(64)
  }

  const parentFactor = 64 ** folderArray.length
  if (parentFactor < totalFolders) {
    folderArray.push(Math.ceil(totalFolders / parentFactor))
  }

  return folderArray

  /*
  const maxRecords = currentFolderPosition === 0 
                     ? RECORDS_PER_FOLDER
                     : currentFolderPosition * 64 * RECORDS_PER_FOLDER;

  if(maxRecords < recordNode.estimatedRecordCount) {
    return folderStructureArray(
            recordNode,
            [...currentArray, 64], 
            currentFolderPosition + 1);
  } else {
    const childFolderCount = Math.ceil(recordNode.estimatedRecordCount / maxRecords );
    return [...currentArray, childFolderCount]
  }*/
}

export const getAllIdsIterator = app => async collection_Key_or_NodeKey => {
  collection_Key_or_NodeKey = safeKey(collection_Key_or_NodeKey)
  const recordNode = getCollectionNodeByKeyOrNodeKey(
    app.hierarchy,
    collection_Key_or_NodeKey
  ) || getNodeByKeyOrNodeKey(app.hierarchy, collection_Key_or_NodeKey)

  const getAllIdsIteratorForCollectionKey = async (
    recordNode,
    collectionKey
  ) => {
    const folderStructure = folderStructureArray(recordNode)

    let currentFolderContents = []
    let currentPosition = []

    const collectionDir = getCollectionDir(app.hierarchy, collectionKey)
    const basePath = joinKey(collectionDir, recordNode.nodeId.toString())

    // "folderStructure" determines the top, sharding folders
    // we need to add one, for the collection root folder, which
    // always  exists
    const levels = folderStructure.length + 1
    const topLevel = levels - 1

    /* populate initial directory structure in form:
    [
      {path: "/a", contents: ["b", "c", "d"]}, 
      {path: "/a/b", contents: ["e","f","g"]},
      {path: "/a/b/e", contents: ["1-abcd","2-cdef","3-efgh"]}, 
    ]
    // stores contents on each parent level
    // top level has ID folders 
    */
    const firstFolder = async () => {
      let folderLevel = 0

      const lastPathHasContent = () =>
        folderLevel === 0 ||
        currentFolderContents[folderLevel - 1].contents.length > 0

      while (folderLevel <= topLevel && lastPathHasContent()) {
        let thisPath = basePath
        for (let lev = 0; lev < currentPosition.length; lev++) {
          thisPath = joinKey(thisPath, currentFolderContents[lev].contents[0])
        }

        const contentsThisLevel = await app.datastore.getFolderContents(
          thisPath
        )
        currentFolderContents.push({
          contents: contentsThisLevel,
          path: thisPath,
        })

        // should start as something like [0,0]
        if (folderLevel < topLevel) currentPosition.push(0)

        folderLevel += 1
      }

      return currentPosition.length === levels - 1
    }

    const isOnLastFolder = level => {
      const result =
        currentPosition[level] ===
        currentFolderContents[level].contents.length - 1
      return result
    }

    const getNextFolder = async (lev = undefined) => {
      lev = isUndefined(lev) ? topLevel : lev
      const parentLev = lev - 1

      if (parentLev < 0) return false

      if (isOnLastFolder(parentLev)) {
        return await getNextFolder(parentLev)
      }

      const newPosition = currentPosition[parentLev] + 1
      currentPosition[parentLev] = newPosition

      const nextFolder = joinKey(
        currentFolderContents[parentLev].path,
        currentFolderContents[parentLev].contents[newPosition]
      )
      currentFolderContents[
        lev
      ].contents = await app.datastore.getFolderContents(nextFolder)
      currentFolderContents[lev].path = nextFolder

      if (lev !== topLevel) {
        // we just advanced a parent folder, so now need to
        // do the same to the next levels
        let loopLevel = lev + 1
        while (loopLevel <= topLevel) {
          const loopParentLevel = loopLevel - 1

          currentPosition[loopParentLevel] = 0
          const nextLoopFolder = joinKey(
            currentFolderContents[loopParentLevel].path,
            currentFolderContents[loopParentLevel].contents[0]
          )
          currentFolderContents[
            loopLevel
          ].contents = await app.datastore.getFolderContents(nextLoopFolder)
          currentFolderContents[loopLevel].path = nextLoopFolder
          loopLevel += 1
        }
      }

      // true ==has more ids... (just loaded more)
      return true
    }

    const idsCurrentFolder = () =>
      currentFolderContents[currentFolderContents.length - 1].contents

    const fininshedResult = { done: true, result: { ids: [], collectionKey } }

    let hasStarted = false
    let hasMore = true
    const getIdsFromCurrentfolder = async () => {
      if (!hasMore) {
        return fininshedResult
      }

      if (!hasStarted) {
        hasMore = await firstFolder()
        hasStarted = true
        return {
          result: {
            ids: idsCurrentFolder(),
            collectionKey,
          },
          done: false,
        }
      }

      hasMore = await getNextFolder()

      return {
        result: {
          ids: hasMore ? idsCurrentFolder() : [],
          collectionKey,
        },
        done: !hasMore,
      }
    }

    return getIdsFromCurrentfolder
  }

  const ancestors = $(getFlattenedHierarchy(app.hierarchy), [
    filter(isCollectionRecord),
    filter(
      n => isAncestor(recordNode)(n) || n.nodeKey() === recordNode.nodeKey()
    ),
    orderBy([n => n.nodeKey().length], ["asc"]),
  ]) // parents first

  const traverseForIteraterators = async (
    parentRecordKey = "",
    currentNodeIndex = 0
  ) => {
    const currentNode = ancestors[currentNodeIndex]
    const currentCollectionKey = joinKey(
      parentRecordKey,
      currentNode.collectionName
    )
    if (currentNode.nodeKey() === recordNode.nodeKey()) {
      return [
        await getAllIdsIteratorForCollectionKey(
          currentNode,
          currentCollectionKey
        ),
      ]
    }
    const allIterators = []
    const currentIterator = await getAllIdsIteratorForCollectionKey(
      currentNode,
      currentCollectionKey
    )

    let ids = await currentIterator()
    while (ids.done === false) {
      for (const id of ids.result.ids) {
        allIterators.push(
          await traverseForIteraterators(
            joinKey(currentCollectionKey, id),
            currentNodeIndex + 1
          )
        )
      }

      ids = await currentIterator()
    }

    return flatten(allIterators)
  }

  const iteratorsArray = await traverseForIteraterators()
  let currentIteratorIndex = 0
  return async () => {
    if (iteratorsArray.length === 0) {
      return { done: true, result: [] }
    }
    const innerResult = await iteratorsArray[currentIteratorIndex]()
    if (!innerResult.done) {
      return innerResult
    }
    if (currentIteratorIndex == iteratorsArray.length - 1) {
      return { done: true, result: innerResult.result }
    }
    currentIteratorIndex++
    return { done: false, result: innerResult.result }
  }
}

export default getAllIdsIterator
