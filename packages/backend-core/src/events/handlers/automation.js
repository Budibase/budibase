const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_CREATED, properties)
}

// TODO
exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_DELETED, properties)
}

// TODO
exports.tested = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_TESTED, properties)
}

// TODO
exports.run = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_RUN, properties)
}

// TODO
exports.stepCreated = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_STEP_CREATED, properties)
}

// TODO
exports.stepDeleted = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_STEP_DELETED, properties)
}
