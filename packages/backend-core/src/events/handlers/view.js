const events = require("../events")
const { Events } = require("../constants")

/* eslint-disable */

exports.created = () => {
  const properties = {}
  events.processEvent(Events.VIEW_CREATED, properties)
}

exports.updated = () => {
  const properties = {}
  events.processEvent(Events.VIEW_UPDATED, properties)
}

exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.VIEW_DELETED, properties)
}

exports.exported = (table, format) => {
  const properties = {}
  events.processEvent(Events.VIEW_EXPORTED, properties)
}

exports.filterCreated = () => {
  const properties = {}
  events.processEvent(Events.VIEW_FILTER_CREATED, properties)
}

exports.filterUpdated = () => {
  const properties = {}
  events.processEvent(Events.VIEW_FILTER_UPDATED, properties)
}

exports.filterDeleted = () => {
  const properties = {}
  events.processEvent(Events.VIEW_FILTER_DELETED, properties)
}

exports.calculationCreated = () => {
  const properties = {}
  events.processEvent(Events.VIEW_CALCULATION_CREATED, properties)
}

exports.calculationUpdated = () => {
  const properties = {}
  events.processEvent(Events.VIEW_CALCULATION_UPDATED, properties)
}

exports.calculationDeleted = () => {
  const properties = {}
  events.processEvent(Events.VIEW_CALCULATION_DELETED, properties)
}
