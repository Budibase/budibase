const events = require("../events")
const { Events } = require("../constants")

// TODO
exports.created = () => {
  const properties = {}
  events.processEvent(Events.SCREEN_CREATED, properties)
}

// TODO
exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.SCREEN_DELETED, properties)
}
