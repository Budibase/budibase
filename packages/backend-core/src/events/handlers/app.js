const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.APP_CREATED, properties)
}

exports.updated = () => {
  const properties = {}
  events.processEvent(Events.APP_UPDATED, properties)
}

exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.APP_DELETED, properties)
}

exports.published = () => {
  const properties = {}
  events.processEvent(Events.APP_PUBLISHED, properties)
}

exports.unpublished = () => {
  const properties = {}
  events.processEvent(Events.APP_UNPUBLISHED, properties)
}

exports.fileImported = () => {
  const properties = {}
  events.processEvent(Events.APP_FILE_IMPORTED, properties)
}

exports.templateImported = templateKey => {
  const properties = {
    templateKey,
  }
  events.processEvent(Events.APP_TEMPLATE_IMPORTED, properties)
}

exports.versionUpdated = () => {
  const properties = {}
  events.processEvent(Events.APP_VERSION_UPDATED, properties)
}

exports.versionReverted = () => {
  const properties = {}
  events.processEvent(Events.APP_VERSION_REVERTED, properties)
}

exports.reverted = () => {
  const properties = {}
  events.processEvent(Events.APP_REVERTED, properties)
}

// TODO
exports.exported = () => {
  const properties = {}
  events.processEvent(Events.APP_EXPORTED, properties)
}
