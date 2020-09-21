const EventEmitter = require("events").EventEmitter

/**
 * keeping event emitter in one central location as it might be used for things other than
 * automations (what it was for originally) - having a central emitter will be useful in the
 * future.
 */

const emitter = new EventEmitter()

module.exports = emitter
