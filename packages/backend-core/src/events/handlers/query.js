const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.QUERY_CREATED, properties)
}

// TODO
exports.updated = () => {
  const properties = {}
  events.processEvent(Events.QUERY_UPDATED, properties)
}

// TODO
exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.QUERY_DELETED, properties)
}

// TODO
exports.imported = () => {
  const properties = {}
  events.processEvent(Events.QUERY_IMPORTED, properties)
}

// TODO
exports.run = () => {
  const properties = {}
  events.processEvent(Events.QUERY_RUN, properties)
}

// TODO
exports.previewed = () => {
  const properties = {}
  events.processEvent(Events.QUERY_PREVIEWED, properties)
}
