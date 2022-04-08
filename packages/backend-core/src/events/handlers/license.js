const events = require("../events")
const { Events } = require("../constants")

// TODO
exports.updgraded = () => {
  const properties = {}
  events.processEvent(Events.LICENSE_UPGRADED, properties)
}

// TODO
exports.downgraded = () => {
  const properties = {}
  events.processEvent(Events.LICENSE_DOWNGRADED, properties)
}

// TODO
exports.updated = () => {
  const properties = {}
  events.processEvent(Events.LICENSE_UPDATED, properties)
}

// TODO
exports.activated = () => {
  const properties = {}
  events.processEvent(Events.LICENSE_ACTIVATED, properties)
}

// TODO
exports.quotaExceeded = (quotaName, value) => {
  const properties = {
    name: quotaName,
    value,
  }
  events.processEvent(Events.LICENSE_QUOTA_EXCEEDED, properties)
}
