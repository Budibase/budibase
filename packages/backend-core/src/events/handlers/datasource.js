const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.DATASOURCE_CREATED, properties)
}

exports.updated = () => {
  const properties = {}
  events.processEvent(Events.DATASOURCE_UPDATED, properties)
}

exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.DATASOURCE_DELETED, properties)
}
