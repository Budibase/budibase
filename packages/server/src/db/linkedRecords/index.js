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

exports.EventType = EventType

/**
 * Creates the link view for the instance, this will overwrite the existing one, but this should only
 * be called if it is found that the view does not exist.
 * @param {string} instanceId The instance to which the view should be added.
 * @returns {Promise<void>} The view now exists, please note that the next view of this query will actually build it,
 * so it may be slow.
 */
exports.createLinkView = async instanceId => {
  const db = new CouchDB(instanceId)
  const designDoc = await db.get("_design/database")
  const view = {
    map: function(doc) {
      if (doc.type === "link") {
        let doc1 = doc.doc1
        let doc2 = doc.doc2
        emit([doc1.modelId, 1, doc1.fieldName, doc1.recordId], doc2.recordId)
        emit([doc2.modelId, 1, doc2.fieldName, doc2.recordId], doc1.recordId)
        emit([doc1.modelId, 2, doc1.recordId], doc2.recordId)
        emit([doc2.modelId, 2, doc2.recordId], doc1.recordId)
      }
    }.toString(),
  }
  designDoc.views = {
    ...designDoc.views,
    by_link: view,
  }
  await db.put(designDoc)
}

/**
 * Update link documents for a record or model - this is to be called by the API controller when a change is occurring.
 * @param {string} eventType states what type of change which is occurring, means this can be expanded upon in the
 * future quite easily (all updates go through one function).
 * @param {string} instanceId The ID of the instance in which the change is occurring.
 * @param {string} modelId The ID of the of the model which is being changed.
 * * @param {object|null} record The record which is changing, e.g. created, updated or deleted.
 * @param {object|null} model If the model has already been retrieved this can be used to reduce database gets.
 * @returns {Promise<object>} When the update is complete this will respond successfully. Returns the record for
 * record operations and the model for model operations.
 */
exports.updateLinks = async ({
  eventType,
  instanceId,
  record,
  modelId,
  model,
}) => {
  // make sure model ID is set
  if (model != null) {
    modelId = model._id
  }
  let linkController = new LinkController({
    instanceId,
    modelId,
    model,
    record,
  })
  if (!(await linkController.doesModelHaveLinkedFields())) {
    return record
  }
  switch (eventType) {
    case EventType.RECORD_SAVE:
    case EventType.RECORD_UPDATE:
      return await linkController.recordSaved()
    case EventType.RECORD_DELETE:
      return await linkController.recordDeleted()
    case EventType.MODEL_SAVE:
      return await linkController.modelSaved()
    case EventType.MODEL_DELETE:
      return await linkController.modelDeleted()
    default:
      throw "Type of event is not known, linked record handler requires update."
  }
}

/**
 * Utility function to in parallel up a list of records with link info.
 * @param {string} instanceId The instance in which this record has been created.
 * @param {object[]} records A list records to be updated with link info.
 * @returns {Promise<object[]>} The updated records (this may be the same if no links were found).
 */
exports.attachLinkInfo = async (instanceId, records) => {
  let recordPromises = []
  for (let record of records) {
    recordPromises.push(exports.attachLinkInfo(instanceId, record))
  }
  return await Promise.all(recordPromises)
}

/**
 * Update a record with information about the links that pertain to it.
 * @param {string} instanceId The instance in which this record has been created.
 * @param {object} record The record itself which is to be updated with info (if applicable).
 * @returns {Promise<object>} The updated record (this may be the same if no links were found).
 */
exports.attachLinkInfo = async (instanceId, record) => {
  // first check if the record has any link fields
  let hasLinkedRecords = false
  for (let fieldName of Object.keys(record)) {
    let field = record[fieldName]
    if (field != null && field.type === "link") {
      hasLinkedRecords = true
      break
    }
  }
  // no linked records, can simply return
  if (!hasLinkedRecords) {
    return record
  }
  const recordId = record._id
  const modelId = record.modelId
  // get all links for record, ignore fieldName for now
  const linkDocs = await exports.getLinkDocuments({
    instanceId,
    modelId,
    recordId,
    includeDocs: true,
  })
  if (linkDocs == null || linkDocs.length === 0) {
    return record
  }
  for (let linkDoc of linkDocs) {
    // work out which link pertains to this record
    const doc = linkDoc.doc1.recordId === recordId ? linkDoc.doc1 : linkDoc.doc2
    if (record[doc.fieldName].count == null) {
      record[doc.fieldName].count = 1
    } else {
      record[doc.fieldName].count++
    }
  }
  return record
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
 * @param {boolean|null} includeDocs whether to include docs in the response call, this is considerably slower so only
 * use this if actually interested in the docs themselves.
 * @returns {Promise<object[]>} This will return an array of the linking documents that were found
 * (if any).
 */
exports.getLinkDocuments = async ({
  instanceId,
  modelId,
  fieldName,
  recordId,
  includeDocs,
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
  params.include_docs = !!includeDocs
  try {
    const response = await db.query("database/by_link", params)
    return response.rows.map(row => row.doc)
  } catch (err) {
    // check if the view doesn't exist, it should for all new instances
    if (err != null && err.name === "not_found") {
      await exports.createLinkView(instanceId)
    } else {
      console.error(err)
    }
  }
}
