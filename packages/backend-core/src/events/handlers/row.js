const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.ROW_CREATED, properties)
}

// TODO
exports.imported = () => {
  const properties = {}
  events.processEvent(Events.ROW_IMPORTED, properties)
  exports.rowCreated()
}

// TODO
exports.updated = () => {
  const properties = {}
  events.processEvent(Events.ROW_UPDATED, properties)
}

// TODO
exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.ROW_DELETED, properties)
}
