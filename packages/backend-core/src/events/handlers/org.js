const events = require("../events")
const { Events } = require("../constants")

exports.nameUpdated = () => {
  const properties = {}
  events.processEvent(Events.ORG_NAME_UPDATED, properties)
}

exports.logoUpdated = () => {
  const properties = {}
  events.processEvent(Events.ORG_LOGO_UPDATED, properties)
}

exports.platformURLUpdated = () => {
  const properties = {}
  events.processEvent(Events.ORG_PLATFORM_URL_UPDATED, properties)
}

exports.versionChecked = version => {
  const properties = {
    version,
  }
  events.processEvent(Events.UPDATE_VERSION_CHECKED, properties)
}

// TODO
exports.analyticsOptOut = () => {
  const properties = {}
  events.processEvent(Events.ANALYTICS_OPT_OUT, properties)
}
