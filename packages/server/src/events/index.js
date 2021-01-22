const EventEmitter = require("events").EventEmitter
const { rowEmission, tableEmission } = require("./utils")

/**
 * keeping event emitter in one central location as it might be used for things other than
 * automations (what it was for originally) - having a central emitter will be useful in the
 * future.
 */

/**
 * Extending the standard emitter to some syntactic sugar and standardisation to the emitted event.
 * This is specifically quite important for template strings used in automations.
 */
class BudibaseEmitter extends EventEmitter {
  emitRow(eventName, appId, row, table = null) {
    rowEmission({ emitter: this, eventName, appId, row, table })
  }

  emitTable(eventName, appId, table = null) {
    tableEmission({ emitter: this, eventName, appId, table })
  }
}

const emitter = new BudibaseEmitter()

module.exports = emitter
