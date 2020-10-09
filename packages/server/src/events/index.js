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
  emitRecord(eventName, instanceId, record, table = null) {
    let event = {
      record,
      instanceId,
      tableId: record.tableId,
    }
    if (table) {
      event.table = table
    }
    event.id = record._id
    if (record._rev) {
      event.revision = record._rev
    }
    this.emit(eventName, event)
  }

  emitTable(eventName, instanceId, table = null) {
    const tableId = table._id
    let event = {
      table: {
        ...table,
        tableId: tableId,
      },
      instanceId,
      tableId: tableId,
    }
    event.id = tableId
    if (table._rev) {
      event.revision = table._rev
    }
    this.emit(eventName, event)
  }
}

const emitter = new BudibaseEmitter()

module.exports = emitter
