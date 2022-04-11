const events = require("../events")
const { Events } = require("../constants")

/* eslint-disable */

exports.created = table => {
  const properties = {}
  events.processEvent(Events.TABLE_CREATED, properties)
}

exports.updated = table => {
  const properties = {}
  events.processEvent(Events.TABLE_UPDATED, properties)
}

exports.deleted = table => {
  const properties = {}
  events.processEvent(Events.TABLE_DELETED, properties)
}

exports.exported = (table, format) => {
  const properties = {}
  events.processEvent(Events.TABLE_EXPORTED, properties)
}

exports.imported = (table, format) => {
  const properties = {}
  events.processEvent(Events.TABLE_IMPORTED, properties)
}

// TODO
exports.permissionUpdated = () => {
  const properties = {}
  events.processEvent(Events.TABLE_PERMISSION_UPDATED, properties)
}
