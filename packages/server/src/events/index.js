const EventEmitter = require("events").EventEmitter

/**
 * keeping event emitter in one central location as it might be used for things other than
 * automations (what it was for originally) - having a central emitter will be useful in the
 * future.
 */

/**
 * Extending the standard emitter to some syntactic sugar and standardisation to the emitted event.
 * This is specifically quite important for mustache used in automations.
 */
class BudibaseEmitter extends EventEmitter {
  emitRecord(eventName, instanceId, record, model = null) {
    let event = {
      record,
      instanceId,
      modelId: record.modelId,
    }
    if (model) {
      event.model = model
    }
    event.id = record._id
    if (record._rev) {
      event.revision = record._rev
    }
    this.emit(eventName, event)
  }

  emitModel(eventName, instanceId, model = null) {
    const modelId = model._id
    let event = {
      model: {
        ...model,
        modelId: modelId,
      },
      instanceId,
      modelId: modelId,
    }
    event.id = modelId
    if (model._rev) {
      event.revision = model._rev
    }
    this.emit(eventName, event)
  }
}

const emitter = new BudibaseEmitter()

module.exports = emitter
