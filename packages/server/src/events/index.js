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
  emitRow(eventName, appId, row, table = null) {
    let event = {
      row,
      appId,
      tableId: row.tableId,
    }
    if (table) {
      event.table = table
    }
    event.id = row._id
    if (row._rev) {
      event.revision = row._rev
    }
    this.emit(eventName, event)
  }

  emitTable(eventName, appId, table = null) {
    const tableId = table._id
    let event = {
      table: {
        ...table,
        tableId: tableId,
      },
      appId,
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
