const events = require("../events")
const { Events } = require("../constants")

// TODO
exports.builderServed = () => {
  const properties = {}
  events.processEvent(Events.BUILDER_SERVED, properties)
}

// TODO
exports.clientServed = () => {
  const properties = {}
  events.processEvent(Events.CLIENT_SERVED, properties)
}
