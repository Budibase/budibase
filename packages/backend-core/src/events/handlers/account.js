const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.ACCOUNT_CREATED, properties)
}

exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.ACCOUNT_DELETED, properties)
}

exports.verified = () => {
  const properties = {}
  events.processEvent(Events.ACCOUNT_VERIFIED, properties)
}
