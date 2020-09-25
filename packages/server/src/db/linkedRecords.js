const CouchDB = require("./index")
const emitter = require("../events/index")
const InMemoryQueue = require("../utilities/queue/inMemoryQueue")

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

function doesModelHaveLinkedRecords(model) {
  for (let key of Object.keys(model.schema)) {
    const { type } = model.schema[key]
    if (type === "link") {
      return true
    }
  }
  return false
}

linkedRecordQueue.process(async job => {
  let event = job.data
  // can't operate without these properties
  if (event.instanceId == null || event.modelId == null) {
    return
  }
  const db = new CouchDB(event.instanceId)
  let model = event.model == null ? await db.get(event.modelId) : event.model
  // model doesn't have links, can stop here
  if (!doesModelHaveLinkedRecords(model)) {
    return
  }
  // no linked records to operate on
  if (model == null) {
    return
  }
  switch (event.type) {
    case EventType.RECORD_SAVE:
      break
    case EventType.RECORD_UPDATE:
      break
    case EventType.RECORD_DELETE:
      break
    case EventType.MODEL_SAVE:
      break
    case EventType.MODEL_DELETE:
      break
  }
})
