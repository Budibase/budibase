import { compileCode } from "@nx-js/compiler-util"
import { filter, includes, map, last } from "lodash/fp"
import {
  getActualKeyOfParent,
  isGlobalIndex,
  getParentKey,
  isShardedIndex,
} from "../templateApi/hierarchy"
import { joinKey, isNonEmptyString, splitKey, $ } from "../common"

export const getIndexedDataKey = (indexNode, indexDir, record) => {
  const getShardName = (indexNode, record) => {
    const shardNameFunc = compileCode(indexNode.getShardName)
    try {
      return shardNameFunc({ record })
    } catch (e) {
      const errorDetails = `shardCode: ${
        indexNode.getShardName
      } :: record: ${JSON.stringify(record)} :: `
      e.message =
        "Error running index shardname func: " + errorDetails + e.message
      throw e
    }
  }

  const shardName = isNonEmptyString(indexNode.getShardName)
    ? `${getShardName(indexNode, record)}.csv`
    : "index.csv"

  return joinKey(indexDir, shardName)
}

export const getShardKeysInRange = async (
  app,
  indexNode,
  indexDir,
  startRecord = null,
  endRecord = null
) => {
  const startShardName = !startRecord
    ? null
    : shardNameFromKey(getIndexedDataKey(indexNode, indexDir, startRecord))

  const endShardName = !endRecord
    ? null
    : shardNameFromKey(getIndexedDataKey(indexNode, indexDir, endRecord))

  return $(await getShardMap(app.datastore, indexDir), [
    filter(
      k =>
        (startRecord === null || k >= startShardName) &&
        (endRecord === null || k <= endShardName)
    ),
    map(k => joinKey(indexDir, `${k}.csv`)),
  ])
}

export const ensureShardNameIsInShardMap = async (
  store,
  indexDir,
  indexedDataKey
) => {
  const map = await getShardMap(store, indexDir)
  const shardName = shardNameFromKey(indexedDataKey)
  if (!includes(shardName)(map)) {
    map.push(shardName)
    await writeShardMap(store, indexDir, map)
  }
}

export const getShardMap = async (datastore, indexDir) => {
  const shardMapKey = getShardMapKey(indexDir)
  try {
    return await datastore.loadJson(shardMapKey)
  } catch (_) {
    await datastore.createJson(shardMapKey, [])
    return []
  }
}

export const writeShardMap = async (datastore, indexDir, shardMap) =>
  await datastore.updateJson(getShardMapKey(indexDir), shardMap)

export const getAllShardKeys = async (app, indexNode, indexDir) =>
  await getShardKeysInRange(app, indexNode, indexDir)

export const getShardMapKey = indexDir => joinKey(indexDir, "shardMap.json")

export const getUnshardedIndexDataKey = indexDir =>
  joinKey(indexDir, "index.csv")

export const createIndexFile = async (datastore, indexedDataKey, index) => {
  if (isShardedIndex(index)) {
    const indexDir = getParentKey(indexedDataKey)
    const shardMap = await getShardMap(datastore, indexDir)
    shardMap.push(shardNameFromKey(indexedDataKey))
    await writeShardMap(datastore, indexDir, shardMap)
  }
  await datastore.createFile(indexedDataKey, "")
}

export const shardNameFromKey = key =>
  $(key, [splitKey, last]).replace(".csv", "")

export const getIndexKey_BasedOnDecendant = (decendantKey, indexNode) => {
  if (isGlobalIndex(indexNode)) {
    return `${indexNode.nodeKey()}`
  }

  const indexedDataParentKey = getActualKeyOfParent(
    indexNode.parent().nodeKey(),
    decendantKey
  )

  return joinKey(indexedDataParentKey, indexNode.name)
}
