const events = require("../events")
const { Events } = require("../constants")

// LAYOUT

// TODO
exports.created = () => {
  const properties = {}
  events.processEvent(Events.LAYOUT_CREATED, properties)
}

// TODO
exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.LAYOUT_DELETED, properties)
}
