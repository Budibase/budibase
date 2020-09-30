const LinkController = require("./LinkController")
const CouchDB = require("../index")
const Sentry = require("@sentry/node")

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
        emit([doc1.modelId, doc1.recordId], {
          id: doc2.recordId,
          fieldName: doc1.fieldName,
        })
        emit([doc2.modelId, doc2.recordId], {
          id: doc1.recordId,
          fieldName: doc2.fieldName,
        })
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
 * Update a record with information about the links that pertain to it.
 * @param {string} instanceId The instance in which this record has been created.
 * @param {object} records The record(s) themselves which is to be updated with info (if applicable). This can be
 * a single record object or an array of records - both will be handled.
 * @returns {Promise<object>} The updated record (this may be the same if no links were found). If an array was input
 * then an array will be output, object input -> object output.
 */
exports.attachLinkInfo = async (instanceId, records) => {
  // handle a single record as well as multiple
  let wasArray = true
  if (!(records instanceof Array)) {
    records = [records]
    wasArray = false
  }
  // start by getting all the link values for performance reasons
  let responses = await Promise.all(
    records.map(record =>
      exports.getLinkDocuments({
        instanceId,
        modelId: record.modelId,
        recordId: record._id,
        includeDocs: false,
      })
    )
  )
  // can just use an index to access responses, order maintained
  let index = 0
  // now iterate through the records and all field information
  for (let record of records) {
    // get all links for record, ignore fieldName for now
    const linkVals = responses[index++]
    for (let linkVal of linkVals) {
      // work out which link pertains to this record
      if (!(record[linkVal.fieldName] instanceof Array)) {
        record[linkVal.fieldName] = [linkVal.id]
      } else {
        record[linkVal.fieldName].push(linkVal.id)
      }
    }
  }
  // if it was an array when it came in then handle it as an array in response
  // otherwise return the first element as there was only one input
  return wasArray ? records : records[0]
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
  recordId,
  includeDocs,
}) => {
  const db = new CouchDB(instanceId)
  let params
  if (recordId != null) {
    params = { key: [modelId, recordId] }
  }
  // only model is known
  else {
    params = { startKey: [modelId], endKey: [modelId, {}] }
  }
  params.include_docs = !!includeDocs
  try {
    const response = await db.query("database/by_link", params)
    if (includeDocs) {
      return response.rows.map(row => row.doc)
    } else {
      return response.rows.map(row => row.value)
    }
  } catch (err) {
    // check if the view doesn't exist, it should for all new instances
    if (err != null && err.name === "not_found") {
      await exports.createLinkView(instanceId)
    } else {
      Sentry.captureException(err)
    }
  }
}
