import { ensureShardNameIsInShardMap } from "./sharding"
import { getIndexWriter } from "./serializer"
import { isShardedIndex, getParentKey } from "../templateApi/hierarchy"
import { promiseWriteableStream } from "./promiseWritableStream"
import { promiseReadableStream } from "./promiseReadableStream"

export const applyToShard = async (
  hierarchy,
  store,
  indexDir,
  indexNode,
  indexShardKey,
  recordsToWrite,
  keysToRemove
) => {
  const createIfNotExists = recordsToWrite.length > 0
  const writer = await getWriter(
    hierarchy,
    store,
    indexDir,
    indexShardKey,
    indexNode,
    createIfNotExists
  )
  if (writer === SHARD_DELETED) return

  await writer.updateIndex(recordsToWrite, keysToRemove)
  await swapTempFileIn(store, indexShardKey)
}

const SHARD_DELETED = "SHARD_DELETED"
const getWriter = async (
  hierarchy,
  store,
  indexDir,
  indexedDataKey,
  indexNode,
  createIfNotExists
) => {
  let readableStream = null

  if (isShardedIndex(indexNode)) {
    await ensureShardNameIsInShardMap(store, indexDir, indexedDataKey)
    if (!(await store.exists(indexedDataKey))) {
      if (await store.exists(getParentKey(indexedDataKey))) {
        await store.createFile(indexedDataKey, "")
      } else {
        return SHARD_DELETED
      }
    }
  }

  try {
    readableStream = promiseReadableStream(
      await store.readableFileStream(indexedDataKey)
    )
  } catch (e) {
    if (await store.exists(indexedDataKey)) {
      throw e
    } else {
      if (createIfNotExists) {
        if (await store.exists(getParentKey(indexedDataKey))) {
          await store.createFile(indexedDataKey, "")
        } else {
          return SHARD_DELETED
        }
      } else {
        return SHARD_DELETED
      }

      readableStream = promiseReadableStream(
        await store.readableFileStream(indexedDataKey)
      )
    }
  }

  const writableStream = promiseWriteableStream(
    await store.writableFileStream(indexedDataKey + ".temp")
  )

  return getIndexWriter(hierarchy, indexNode, readableStream, writableStream)
}

const swapTempFileIn = async (store, indexedDataKey, isRetry = false) => {
  const tempFile = `${indexedDataKey}.temp`
  try {
    await store.deleteFile(indexedDataKey)
  } catch (e) {
    // ignore failure, incase it has not been created yet

    // if parent folder does not exist, assume that this index
    // should not be there
    if (!(await store.exists(getParentKey(indexedDataKey)))) {
      return
    }
  }
  try {
    await store.renameFile(tempFile, indexedDataKey)
  } catch (e) {
    // retrying in case delete failure was for some other reason
    if (!isRetry) {
      await swapTempFileIn(store, indexedDataKey, true)
    } else {
      throw new Error("Failed to swap in index filed: " + e.message)
    }
  }
}
