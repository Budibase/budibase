const emitter = require("../../events")
const InMemoryQueue = require("../../utilities/queue/inMemoryQueue")
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

const linkedRecordQueue = new InMemoryQueue("linkedRecordQueue")

function createEmitterCallback(eventName) {
  emitter.on(eventName, function(event) {
    if (!event || !event.record || !event.record.modelId) {
      return
    }
    linkedRecordQueue.add({
      type: eventName,
      event,
    })
  })
}

for (let typeKey of Object.keys(EventType)) {
  createEmitterCallback(EventType[typeKey])
}

linkedRecordQueue.process(async job => {
  let data = job.data
  // can't operate without these properties
  if (data.instanceId == null || data.modelId == null) {
    return
  }
  // link controller exists to help manage state, the operation
  // of updating links is a particularly stateful task
  let linkController = new LinkController(data.instanceId, data)
  // model doesn't have links, can stop here
  if (!(await linkController.doesModelHaveLinkedFields())) {
    return
  }
  // carry out the logic at a top level so that we can handle
  // multiple operations for a single queue entry if desired
  switch (data.type) {
    case EventType.RECORD_SAVE:
    case EventType.RECORD_UPDATE:
      await linkController.recordSaved()
      break
    case EventType.RECORD_DELETE:
      await linkController.recordDeleted()
      break
    case EventType.MODEL_SAVE:
      await linkController.modelSaved()
      break
    case EventType.MODEL_DELETE:
      await linkController.modelDeleted()
      break
  }
})

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
  const response = await db.query("database/by_link", params)
  return response.rows.map(row => row.doc)
}
