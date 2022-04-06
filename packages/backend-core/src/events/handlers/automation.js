const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_CREATED, properties)
}

exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_DELETED, properties)
}

exports.tested = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_TESTED, properties)
}

// TODO
// exports.run = () => {
//   const properties = {}
//   events.processEvent(Events.AUTOMATION_RUN, properties)
// }

exports.stepCreated = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_STEP_CREATED, properties)
}

exports.stepDeleted = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_STEP_DELETED, properties)
}

exports.triggerUpdated = () => {
  const properties = {}
  events.processEvent(Events.AUTOMATION_TRIGGER_UPDATED, properties)
}
