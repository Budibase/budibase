const LinkController = require("./LinkController")
const { IncludeDocs, getLinkDocuments, createLinkView } = require("./linkUtils")

/**
 * This functionality makes sure that when records with links are created, updated or deleted they are processed
 * correctly - making sure that no stale links are left around and that all links have been made successfully.
 */

const EventType = {
  RECORD_SAVE: "record:save",
  RECORD_UPDATE: "record:update",
  RECORD_DELETE: "record:delete",
  MODEL_SAVE: "model:save",
  MODEL_UPDATED: "model:updated",
  MODEL_DELETE: "model:delete",
}

exports.EventType = EventType
// re-export utils here for ease of use
exports.IncludeDocs = IncludeDocs
exports.getLinkDocuments = getLinkDocuments
exports.createLinkView = createLinkView

/**
 * Update link documents for a record or model - this is to be called by the API controller when a change is occurring.
 * @param {string} eventType states what type of change which is occurring, means this can be expanded upon in the
 * future quite easily (all updates go through one function).
 * @param {string} instanceId The ID of the instance in which the change is occurring.
 * @param {string} modelId The ID of the of the model which is being changed.
 * @param {object|null} record The record which is changing, e.g. created, updated or deleted.
 * @param {object|null} model If the model has already been retrieved this can be used to reduce database gets.
 * @param {object|null} oldModel If the model is being updated then the old model can be provided for differencing.
 * @returns {Promise<object>} When the update is complete this will respond successfully. Returns the record for
 * record operations and the model for model operations.
 */
exports.updateLinks = async function({
  eventType,
  instanceId,
  record,
  modelId,
  model,
  oldModel,
}) {
  if (instanceId == null) {
    throw "Cannot operate without an instance ID."
  }
  // make sure model ID is set
  if (modelId == null && model != null) {
    arguments[0].modelId = model._id
  }
  let linkController = new LinkController(arguments[0])
  if (
    !(await linkController.doesModelHaveLinkedFields()) &&
    (oldModel == null ||
      !(await linkController.doesModelHaveLinkedFields(oldModel)))
  ) {
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
    case EventType.MODEL_UPDATED:
      return await linkController.modelUpdated()
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
      getLinkDocuments({
        instanceId,
        modelId: record.modelId,
        recordId: record._id,
        includeDocs: IncludeDocs.EXCLUDE,
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
