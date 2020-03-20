import { map, filter, groupBy, split, some, find } from "lodash/fp"
import {
  LOCK_FILENAME,
  TRANSACTIONS_FOLDER,
  idSep,
  isUpdate,
  nodeKeyHashFromBuildFolder,
  isBuildIndexFolder,
  getTransactionId,
  isDelete,
  isCreate,
} from "./transactionsCommon"
import { joinKey, $, none, isSomething } from "../common"
import {
  getLastPartInKey,
  getNodeFromNodeKeyHash,
} from "../templateApi/hierarchy"
import { _load } from "../recordApi/load"

export const retrieve = async app => {
  const transactionFiles = await app.datastore.getFolderContents(
    TRANSACTIONS_FOLDER
  )

  if (some(isBuildIndexFolder)(transactionFiles)) {
    const buildIndexFolders = filter(isBuildIndexFolder)(transactionFiles)
    let currentFolderIndex = 0
    while (currentFolderIndex < buildIndexFolders.length) {
      const buildIndexFolder = buildIndexFolders[currentFolderIndex]
      const transactions = await retrieveBuildIndexTransactions(
        app,
        joinKey(TRANSACTIONS_FOLDER, buildIndexFolder)
      )
      if(transactions.length === 0) {
        await app.datastore.deleteFolder(
          joinKey(TRANSACTIONS_FOLDER, buildIndexFolder))
      } else {
        return transactions
      }
      currentFolderIndex += 1
    }
  
    return []
  }

  return await retrieveStandardTransactions(app, transactionFiles)
}

const retrieveBuildIndexTransactions = async (app, buildIndexFolder) => {
  const childFolders = await app.datastore.getFolderContents(buildIndexFolder)
  const childFolderCount = childFolders.length
  if (childFolderCount === 0) {
    return []
  }

  const getTransactionFiles = async (childFolderIndex = 0) => {
    if (childFolderIndex >= childFolders.length) {
      return { childFolderKey: "", files: [] }
    }

    const childFolderKey = joinKey(
      buildIndexFolder,
      childFolders[childFolderIndex]
    )
    const files = await app.datastore.getFolderContents(childFolderKey)

    if (files.length > 0) {
      return { childFolderKey, files } 
    }

    await app.datastore.deleteFolder(childFolderKey)
    return await getTransactionFiles(childFolderIndex + 1)
  }

  const transactionFiles = await getTransactionFiles()

  if (transactionFiles.files.length === 0) {
    return []
  }

  const transactions = $(transactionFiles.files, [map(parseTransactionId)])

  for (const t of transactions) {
    const transactionContent = await app.datastore.loadJson(
      joinKey(transactionFiles.childFolderKey, t.fullId)
    )
    t.record = await _load(app, transactionContent.recordKey)
  }

  transactions.indexNode = $(buildIndexFolder, [
    getLastPartInKey,
    nodeKeyHashFromBuildFolder,
    getNodeFromNodeKeyHash(app.hierarchy),
  ])

  transactions.folderKey = transactionFiles.childFolderKey

  return transactions
}

const retrieveStandardTransactions = async (app, transactionFiles) => {
  const transactionIds = $(transactionFiles, [
    filter(f => f !== LOCK_FILENAME && !isBuildIndexFolder(f)),
    map(parseTransactionId),
  ])

  const transactionIdsByRecord = $(transactionIds, [groupBy("recordId")])

  const dedupedTransactions = []

  const verify = async t => {
    if (t.verified === true) return t

    const id = getTransactionId(t.recordId, t.transactionType, t.uniqueId)

    const transaction = await app.datastore.loadJson(
      joinKey(TRANSACTIONS_FOLDER, id)
    )

    if (isDelete(t)) {
      t.record = transaction.record
      t.verified = true
      return t
    }

    const rec = await _load(app, transaction.recordKey)
    if (rec.transactionId === id) {
      t.record = rec
      if (transaction.oldRecord) {
        t.oldRecord = transaction.oldRecord
      }
      t.verified = true
    } else {
      t.verified = false
    }

    return t
  }

  const pickOne = async (trans, forType) => {
    const transForType = filter(forType)(trans)
    if (transForType.length === 1) {
      const t = await verify(transForType[0])
      return t.verified === true ? t : null
    }
    for (let t of transForType) {
      t = await verify(t)
      if (t.verified === true) {
        return t
      }
    }

    return null
  }

  for (const recordId in transactionIdsByRecord) {
    const transIdsForRecord = transactionIdsByRecord[recordId]
    if (transIdsForRecord.length === 1) {
      const t = await verify(transIdsForRecord[0])
      if (t.verified) {
        dedupedTransactions.push(t)
      }
      continue
    }
    if (some(isDelete)(transIdsForRecord)) {
      const t = await verify(find(isDelete)(transIdsForRecord))
      if (t.verified) {
        dedupedTransactions.push(t)
      }
      continue
    }
    if (some(isUpdate)(transIdsForRecord)) {
      const upd = await pickOne(transIdsForRecord, isUpdate)
      if (isSomething(upd) && upd.verified) {
        dedupedTransactions.push(upd)
      }
      continue
    }
    if (some(isCreate)(transIdsForRecord)) {
      const cre = await pickOne(transIdsForRecord, isCreate)
      if (isSomething(cre)) {
        dedupedTransactions.push(cre)
      }
      continue
    }
  }

  const duplicates = $(transactionIds, [
    filter(t => none(ddt => ddt.uniqueId === t.uniqueId)(dedupedTransactions)),
  ])

  const deletePromises = map(t =>
    app.datastore.deleteFile(
      joinKey(
        TRANSACTIONS_FOLDER,
        getTransactionId(t.recordId, t.transactionType, t.uniqueId)
      )
    )
  )(duplicates)

  await Promise.all(deletePromises)

  return dedupedTransactions
}

const parseTransactionId = id => {
  const splitId = split(idSep)(id)
  return {
    recordId: splitId[0],
    transactionType: splitId[1],
    uniqueId: splitId[2],
    fullId: id,
  }
}
