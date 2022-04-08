const events = require("../events")
const { Events } = require("../constants")

/* eslint-disable */

exports.created = role => {
  const properties = {}
  events.processEvent(Events.ROLE_CREATED, properties)
}

exports.updated = role => {
  const properties = {}
  events.processEvent(Events.ROLE_UPDATED, properties)
}

exports.deleted = role => {
  const properties = {}
  events.processEvent(Events.ROLE_DELETED, properties)
}

exports.assigned = (user, role) => {
  const properties = {}
  events.processEvent(Events.ROLE_ASSIGNED, properties)
}

exports.unassigned = (user, role) => {
  const properties = {}
  events.processEvent(Events.ROLE_UNASSIGNED, properties)
}
