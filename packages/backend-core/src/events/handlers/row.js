const events = require("../events")
const { Events } = require("../constants")

/* eslint-disable */

// exports.created = () => {
//   const properties = {}
//   events.processEvent(Events.ROW_CREATED, properties)
// }

exports.import = (table, format, count) => {
  const properties = {}
  events.processEvent(Events.ROW_IMPORT, properties)
}
