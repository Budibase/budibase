const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.QUERY_CREATED, properties)
}

exports.updated = () => {
  const properties = {}
  events.processEvent(Events.QUERY_UPDATED, properties)
}

exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.QUERY_DELETED, properties)
}

// TODO
exports.import = () => {
  const properties = {}
  events.processEvent(Events.QUERY_IMPORT, properties)
}

// TODO
// exports.run = () => {
//   const properties = {}
//   events.processEvent(Events.QUERY_RUN, properties)
// }

// TODO
exports.previewed = () => {
  const properties = {}
  events.processEvent(Events.QUERY_PREVIEWED, properties)
}
