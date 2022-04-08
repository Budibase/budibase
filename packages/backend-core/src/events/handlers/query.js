const events = require("../events")
const { Events } = require("../constants")

/* eslint-disable */

exports.created = (datasource, query) => {
  const properties = {}
  events.processEvent(Events.QUERY_CREATED, properties)
}

exports.updated = (datasource, query) => {
  const properties = {}
  events.processEvent(Events.QUERY_UPDATED, properties)
}

exports.deleted = (datasource, query) => {
  const properties = {}
  events.processEvent(Events.QUERY_DELETED, properties)
}

exports.import = (datasource, importSource, count) => {
  const properties = {}
  events.processEvent(Events.QUERY_IMPORT, properties)
}

// TODO
// exports.run = () => {
//   const properties = {}
//   events.processEvent(Events.QUERY_RUN, properties)
// }

exports.previewed = datasource => {
  const properties = {}
  events.processEvent(Events.QUERY_PREVIEWED, properties)
}
