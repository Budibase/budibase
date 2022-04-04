const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.ROLE_CREATED, properties)
}

// TODO
exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.ROLE_DELETED, properties)
}

// TODO
exports.assigned = () => {
  const properties = {}
  events.processEvent(Events.ROLE_ASSIGNED, properties)
}
