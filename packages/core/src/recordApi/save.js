import { cloneDeep, take, takeRight, flatten, map, filter } from "lodash/fp"
import { validate } from "./validate"
import { _loadFromInfo } from "./load"
import { apiWrapper, events, $, joinKey } from "../common"
import {
  getFlattenedHierarchy,
  isModel,
  getNode,
  fieldReversesReferenceToNode,
} from "../templateApi/hierarchy"
import {
  transactionForCreateRecord,
  transactionForUpdateRecord,
} from "../transactions/create"
import { permission } from "../authApi/permissions"
import { initialiseIndex } from "../indexing/initialiseIndex"
import { BadRequestError } from "../common/errors"
import { getRecordInfo } from "./recordInfo"
import { initialiseChildren } from "./initialiseChildren"

export const save = app => async (record, context) =>
  apiWrapper(
    app,
    events.recordApi.save,
    record.isNew
      ? permission.createRecord.isAuthorized(record.key)
      : permission.updateRecord.isAuthorized(record.key),
    { record },
    _save,
    app,
    record,
    context,
    false
  )

export const _save = async (app, record, context, skipValidation = false) => {
  const recordClone = cloneDeep(record)
  if (!skipValidation) {
    const validationResult = await validate(app)(recordClone, context)
    if (!validationResult.isValid) {
      await app.publish(events.recordApi.save.onInvalid, {
        record,
        validationResult,
      })
      throw new BadRequestError(
        `Save : Record Invalid : ${JSON.stringify(validationResult.errors)}`
      )
    }
  }

  const recordInfo = getRecordInfo(app.hierarchy, record.key)
  const { recordNode, pathInfo, recordJson, files } = recordInfo

  if (recordClone.isNew) {
    if (!recordNode) throw new Error("Cannot find node for " + record.key)

    const transaction = await transactionForCreateRecord(app, recordClone)
    recordClone.transactionId = transaction.id
    await createRecordFolderPath(app.datastore, pathInfo)
    await app.datastore.createFolder(files)
    await app.datastore.createJson(recordJson, recordClone)
    await initialiseChildren(app, recordInfo)
    await app.publish(events.recordApi.save.onRecordCreated, {
      record: recordClone,
    })
  } else {
    const oldRecord = await _loadFromInfo(app, recordInfo)
    const transaction = await transactionForUpdateRecord(
      app,
      oldRecord,
      recordClone
    )
    recordClone.transactionId = transaction.id
    await app.datastore.updateJson(recordJson, recordClone)
    await app.publish(events.recordApi.save.onRecordUpdated, {
      old: oldRecord,
      new: recordClone,
    })
  }

  await app.cleanupTransactions()

  const returnedClone = cloneDeep(recordClone)
  returnedClone.isNew = false
  return returnedClone
}

const createRecordFolderPath = async (datastore, pathInfo) => {
  const recursiveCreateFolder = async (
    subdirs,
    dirsThatNeedCreated = undefined
  ) => {
    // iterate backwards through directory hierachy
    // until we get to a folder that exists, then create the rest
    // e.g
    // - some/folder/here
    // - some/folder
    // - some
    const thisFolder = joinKey(pathInfo.base, ...subdirs)

    if (await datastore.exists(thisFolder)) {
      let creationFolder = thisFolder
      for (let nextDir of dirsThatNeedCreated || []) {
        creationFolder = joinKey(creationFolder, nextDir)
        await datastore.createFolder(creationFolder)
      }
    } else if (!dirsThatNeedCreated || dirsThatNeedCreated.length > 0) {
      dirsThatNeedCreated = !dirsThatNeedCreated ? [] : dirsThatNeedCreated

      await recursiveCreateFolder(take(subdirs.length - 1)(subdirs), [
        ...takeRight(1)(subdirs),
        ...dirsThatNeedCreated,
      ])
    }
  }

  await recursiveCreateFolder(pathInfo.subdirs)

  return joinKey(pathInfo.base, ...pathInfo.subdirs)
}
