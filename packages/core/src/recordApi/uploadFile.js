import { includes, filter, map, some } from "lodash/fp"
import { generate } from "shortid"
import { _loadFromInfo } from "./load"
import {
  apiWrapper,
  events,
  splitKey,
  $,
  joinKey,
  isNothing,
  tryAwaitOrIgnore,
} from "../common"
import { getExactNodeForKey } from "../templateApi/hierarchy"
import { permission } from "../authApi/permissions"
import { isLegalFilename } from "../types/file"
import { BadRequestError, ForbiddenError } from "../common/errors"
import { getRecordInfo } from "./recordInfo"

export const uploadFile = app => async (
  recordKey,
  readableStream,
  relativeFilePath
) =>
  apiWrapper(
    app,
    events.recordApi.uploadFile,
    permission.updateRecord.isAuthorized(recordKey),
    { recordKey, readableStream, relativeFilePath },
    _uploadFile,
    app,
    recordKey,
    readableStream,
    relativeFilePath
  )

const _uploadFile = async (
  app,
  recordKey,
  readableStream,
  relativeFilePath
) => {
  if (isNothing(recordKey)) {
    throw new BadRequestError("Record Key not supplied")
  }
  if (isNothing(relativeFilePath)) {
    throw new BadRequestError("file path not supplied")
  }
  if (!isLegalFilename(relativeFilePath)) {
    throw new BadRequestError("Illegal filename")
  }

  const recordInfo = getRecordInfo(app.hierarchy, recordKey)
  const record = await _loadFromInfo(app, recordInfo)

  const fullFilePath = safeGetFullFilePath(recordInfo.dir, relativeFilePath)

  const tempFilePath = `${fullFilePath}_${generate()}.temp`

  const outputStream = await app.datastore.writableFileStream(tempFilePath)

  return new Promise((resolve, reject) => {
    readableStream.pipe(outputStream)
    outputStream.on("error", reject)
    outputStream.on("finish", resolve)
  })
    .then(() => app.datastore.getFileSize(tempFilePath))
    .then(size => {
      const isExpectedFileSize = checkFileSizeAgainstFields(
        app,
        record,
        relativeFilePath,
        size
      )
      if (!isExpectedFileSize) {
        throw new BadRequestError(
          `Fields for ${relativeFilePath} do not have expected size.`
        )
      }
    })
    .then(() => tryAwaitOrIgnore(app.datastore.deleteFile, fullFilePath))
    .then(() => app.datastore.renameFile(tempFilePath, fullFilePath))
}

const checkFileSizeAgainstFields = (
  app,
  record,
  relativeFilePath,
  expectedSize
) => {
  const recordNode = getExactNodeForKey(app.hierarchy)(record.key)

  const incorrectFileFields = $(recordNode.fields, [
    filter(
      f =>
        f.type === "file" &&
        record[f.name].relativePath === relativeFilePath &&
        record[f.name].size !== expectedSize
    ),
    map(f => f.name),
  ])

  const incorrectFileArrayFields = $(recordNode.fields, [
    filter(
      a =>
        a.type === "array<file>" &&
        $(record[a.name], [
          some(
            f =>
              record[f.name].relativePath === relativeFilePath &&
              record[f.name].size !== expectedSize
          ),
        ])
    ),
    map(f => f.name),
  ])

  const incorrectFields = [...incorrectFileFields, ...incorrectFileArrayFields]

  if (incorrectFields.length > 0) {
    return false
  }

  return true
}

export const safeGetFullFilePath = (recordDir, relativeFilePath) => {
  const naughtyUser = () => {
    throw new ForbiddenError("naughty naughty")
  }

  if (relativeFilePath.startsWith("..")) naughtyUser()

  const pathParts = splitKey(relativeFilePath)

  if (includes("..")(pathParts)) naughtyUser()

  const recordKeyParts = splitKey(recordDir)

  const fullPathParts = [
    ...recordKeyParts,
    "files",
    ...filter(p => p !== ".")(pathParts),
  ]

  return joinKey(fullPathParts)
}
