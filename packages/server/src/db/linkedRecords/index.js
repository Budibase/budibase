const LinkController = require("./LinkController")
const CouchDB = require("../index")

/**
 * This functionality makes sure that when records with links are created, updated or deleted they are processed
 * correctly - making sure that no stale links are left around and that all links have been made successfully.
 */

const EventType = {
  RECORD_SAVE: "record:save",
  RECORD_UPDATE: "record:update",
  RECORD_DELETE: "record:delete",
  MODEL_SAVE: "model:save",
  MODEL_DELETE: "model:delete",
}

module.exports.EventType = EventType

/**
 * Update link documents for a model - this is to be called by the model controller when a model is being changed.
 * @param {EventType} eventType states what type of model change is occurring, means this can be expanded upon in the
 * future quite easily (all updates go through one function).
 * @param {string} instanceId The ID of the instance in which the model change is occurring.
 * @param {object} model The model which is changing, whether it is being deleted, created or updated.
 * @returns {Promise<null>} When the update is complete this will respond successfully.
 */
module.exports.updateLinksForModel = async ({
  eventType,
  instanceId,
  model,
}) => {
  // can't operate without these properties
  if (instanceId == null || model == null) {
    return null
  }
  let linkController = new LinkController({
    instanceId,
    modelId: model._id,
    model,
  })
  if (!(await linkController.doesModelHaveLinkedFields())) {
    return null
  }
  switch (eventType) {
    case EventType.MODEL_SAVE:
      await linkController.modelSaved()
      break
    case EventType.MODEL_DELETE:
      await linkController.modelDeleted()
      break
    default:
      throw "Type of event is not known, linked record handler requires update."
  }
}

/**
 * Update link documents for a record - this is to be called by the record controller when a record is being changed.
 * @param {EventType} eventType states what type of record change is occurring, means this can be expanded upon in the
 * future quite easily (all updates go through one function).
 * @param {string} instanceId The ID of the instance in which the record update is occurring.
 * @param {object} record The record which is changing, e.g. created, updated or deleted.
 * @param {string} modelId The ID of the of the model which is being updated.
 * @param {object|null} model If the model has already been retrieved this can be used to reduce database gets.
 * @returns {Promise<null>} When the update is complete this will respond successfully.
 */
module.exports.updateLinksForRecord = async ({
  eventType,
  instanceId,
  record,
  modelId,
  model,
}) => {
  // can't operate without these properties
  if (instanceId == null || modelId == null) {
    return null
  }
  let linkController = new LinkController({
    instanceId,
    modelId,
    model,
    record,
  })
  if (!(await linkController.doesModelHaveLinkedFields())) {
    return null
  }
  switch (eventType) {
    case EventType.RECORD_SAVE:
    case EventType.RECORD_UPDATE:
      return await linkController.recordSaved()
    case EventType.RECORD_DELETE:
      return await linkController.recordDeleted()
    default:
      throw "Type of event is not known, linked record handler requires update."
  }
}

/**
 * Gets the linking documents, not the linked documents themselves.
 * @param {string} instanceId The instance in which we are searching for linked records.
 * @param {string} modelId The model which we are searching for linked records against.
 * @param {string|null} fieldName The name of column/field which is being altered, only looking for
 * linking documents that are related to it. If this is not specified then the table level will be assumed.
 * @param {string|null} recordId The ID of the record which we want to find linking documents for -
 * if this is not specified then it will assume model or field level depending on whether the
 * field name has been specified.
 * @param {boolean|null} includeDoc whether to include docs in the response call, this is considerably slower so only
 * use this if actually interested in the docs themselves.
 * @returns {Promise<object[]>} This will return an array of the linking documents that were found
 * (if any).
 */
module.exports.getLinkDocuments = async ({
  instanceId,
  modelId,
  fieldName,
  recordId,
  includeDoc,
}) => {
  const db = new CouchDB(instanceId)
  let params
  if (fieldName != null && recordId != null) {
    params = { key: [modelId, 1, fieldName, recordId] }
  } else if (fieldName != null && recordId == null) {
    params = {
      startKey: [modelId, 1, fieldName],
      endKey: [modelId, 1, fieldName, {}],
    }
  } else if (fieldName == null && recordId != null) {
    params = { key: [modelId, 2, recordId] }
  }
  // only model is known
  else {
    params = { startKey: [modelId, 1], endKey: [modelId, 1, {}] }
  }
  params.include_docs = !!includeDoc
  try {
    const response = await db.query("database/by_link", params)
    return response.rows.map(row => row.doc)
  } catch (err) {
    console.error(err)
  }
}
