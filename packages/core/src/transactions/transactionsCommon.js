import { joinKey, keySep, getHashCode } from "../common"
import { getLastPartInKey } from "../templateApi/hierarchy"

export const TRANSACTIONS_FOLDER = `${keySep}.transactions`
export const LOCK_FILENAME = "lock"
export const LOCK_FILE_KEY = joinKey(TRANSACTIONS_FOLDER, LOCK_FILENAME)
export const idSep = "$"

const isOfType = typ => trans => trans.transactionType === typ

export const CREATE_RECORD_TRANSACTION = "create"
export const UPDATE_RECORD_TRANSACTION = "update"
export const DELETE_RECORD_TRANSACTION = "delete"
export const BUILD_INDEX_TRANSACTION = "build"

export const isUpdate = isOfType(UPDATE_RECORD_TRANSACTION)
export const isDelete = isOfType(DELETE_RECORD_TRANSACTION)
export const isCreate = isOfType(CREATE_RECORD_TRANSACTION)
export const isBuildIndex = isOfType(BUILD_INDEX_TRANSACTION)

export const keyToFolderName = nodeKey => getHashCode(nodeKey)

export const getTransactionId = (recordId, transactionType, uniqueId) =>
  `${recordId}${idSep}${transactionType}${idSep}${uniqueId}`

export const buildIndexFolder = ".BUILD-"
export const nodeKeyHashFromBuildFolder = folder =>
  folder.replace(buildIndexFolder, "")

export const isBuildIndexFolder = key =>
  getLastPartInKey(key).startsWith(buildIndexFolder)

export const IndexNodeKeyFolder = indexNodeKey =>
  joinKey(TRANSACTIONS_FOLDER, buildIndexFolder + keyToFolderName(indexNodeKey))

export const IndexNodeKeyBatchFolder = (indexNodeKey, count) =>
  joinKey(
    IndexNodeKeyFolder(indexNodeKey),
    Math.floor(count / BUILDINDEX_BATCH_COUNT).toString()
  )

export const IndexShardKeyFolder = (indexNodeKey, indexShardKey) =>
  joinKey(IndexNodeKeyFolder(indexNodeKey), indexShardKey)

export const BUILDINDEX_BATCH_COUNT = 1000
export const timeoutMilliseconds = 30 * 1000 // 30 secs
export const maxLockRetries = 1
