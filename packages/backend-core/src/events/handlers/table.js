const events = require("../events")
const { Events } = require("../constants")

exports.created = () => {
  const properties = {}
  events.processEvent(Events.TABLE_CREATED, properties)
}

exports.updated = () => {
  const properties = {}
  events.processEvent(Events.TABLE_UPDATED, properties)
}

exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.TABLE_DELETED, properties)
}

// TODO
exports.exported = () => {
  const properties = {}
  events.processEvent(Events.TABLE_EXPORTED, properties)
}

// TODO
exports.imported = () => {
  const properties = {}
  events.processEvent(Events.TABLE_IMPORTED, properties)
}

// TODO
exports.permissionUpdated = () => {
  const properties = {}
  events.processEvent(Events.TABLE_PERMISSION_UPDATED, properties)
}
