import { keyBy, mapValues } from "lodash/fp"
import { generate } from "shortid"
import {
  getNodeForCollectionPath,
  isSingleRecord,
} from "../templateApi/hierarchy"
import { getNewFieldValue } from "../types"
import { $, joinKey, safeKey, apiWrapperSync, events } from "../common"
import { permission } from "../authApi/permissions"

export const getNew = app => (collectionKey, recordTypeName) => {
  const recordNode = getRecordNode(app, collectionKey, recordTypeName)
  collectionKey = safeKey(collectionKey)
  return apiWrapperSync(
    app,
    events.recordApi.getNew,
    permission.createRecord.isAuthorized(recordNode.nodeKey()),
    { collectionKey, recordTypeName },
    _getNew,
    recordNode,
    collectionKey
  )
}

/**
 * Constructs a record object that can be saved to the backend.
 * @param {*} recordNode - record
 * @param {*} collectionKey - nested collection key that the record will be saved to.
 */
export const _getNew = (recordNode, collectionKey) =>
  constructRecord(recordNode, getNewFieldValue, collectionKey)

const getRecordNode = (app, collectionKey) => {
  collectionKey = safeKey(collectionKey)
  return getNodeForCollectionPath(app.hierarchy)(collectionKey)
}

export const getNewChild = app => (recordKey, collectionName, recordTypeName) =>
  getNew(app)(joinKey(recordKey, collectionName), recordTypeName)

export const constructRecord = (recordNode, getFieldValue, collectionKey) => {
  const record = $(recordNode.fields, [keyBy("name"), mapValues(getFieldValue)])

  record.id = `${recordNode.nodeId}-${generate()}`
  record.key = isSingleRecord(recordNode)
    ? joinKey(collectionKey, recordNode.name)
    : joinKey(collectionKey, record.id)
  record.isNew = true
  record.type = recordNode.name
  return record
}
