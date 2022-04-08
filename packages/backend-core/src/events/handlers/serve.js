const events = require("../events")
const { Events } = require("../constants")

/* eslint-disable */

exports.servedBuilder = version => {
  const properties = {}
  events.processEvent(Events.SERVED_BUILDER, properties)
}

exports.servedApp = appMetadata => {
  const properties = {}
  events.processEvent(Events.SERVED_APP, properties)
}

exports.servedAppPreview = appMetadata => {
  const properties = {}
  events.processEvent(Events.SERVED_APP_PREVIEW, properties)
}
