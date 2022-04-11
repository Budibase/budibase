const events = require("../events")
const { Events } = require("../constants")

/* eslint-disable */

exports.created = () => {
  const properties = {}
  events.processEvent(Events.VIEW_CREATED, properties)
}

// TODO
exports.updated = () => {
  const properties = {}
  events.processEvent(Events.VIEW_UPDATED, properties)
}

// TODO
exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.VIEW_DELETED, properties)
}

exports.exported = (table, format) => {
  const properties = {}
  events.processEvent(Events.VIEW_EXPORTED, properties)
}

// TODO
exports.filterCreated = () => {
  const properties = {}
  events.processEvent(Events.VIEW_FILTER_CREATED, properties)
}

// TODO
exports.filterDeleted = () => {
  const properties = {}
  events.processEvent(Events.VIEW_FILTER_DELETED, properties)
}

// TODO
exports.calculationCreated = () => {
  const properties = {}
  events.processEvent(Events.VIEW_CALCULATION_CREATED, properties)
}

// TODO
exports.calculationDeleted = () => {
  const properties = {}
  events.processEvent(Events.VIEW_CALCULATION_DELETED, properties)
}
