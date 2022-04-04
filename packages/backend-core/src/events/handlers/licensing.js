const events = require("../events")
const { Events } = require("../constants")

exports.quotaExceeded = (quotaName, value) => {
  const properties = {
    name: quotaName,
    value,
  }
  events.processEvent(Events.LICENSING_QUOTA_EXCEEDED, properties)
}
