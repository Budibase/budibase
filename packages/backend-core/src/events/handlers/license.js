const events = require("../events")
const { Events } = require("../constants")

exports.updgraded = () => {
  const properties = {}
  events.processEvent(Events.LICENSE_UPGRADED, properties)
}

exports.downgraded = () => {
  const properties = {}
  events.processEvent(Events.LICENSE_DOWNGRADED, properties)
}

exports.updated = () => {
  const properties = {}
  events.processEvent(Events.LICENSE_UPDATED, properties)
}

exports.activated = () => {
  const properties = {}
  events.processEvent(Events.LICENSE_ACTIVATED, properties)
}

exports.quotaExceeded = (quotaName, value) => {
  const properties = {
    name: quotaName,
    value,
  }
  events.processEvent(Events.LICENSE_QUOTA_EXCEEDED, properties)
}
