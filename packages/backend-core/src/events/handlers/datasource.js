const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.DATASOURCE_CREATED, properties)
}

// TODO
exports.updated = () => {
  const properties = {}
  events.processEvent(Events.DATASOURCE_UPDATED, properties)
}

// TODO
exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.DATASOURCE_DELETED, properties)
}
