const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.SCREEN_CREATED, properties)
}

exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.SCREEN_DELETED, properties)
}
