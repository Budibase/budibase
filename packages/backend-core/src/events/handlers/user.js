const events = require("../events")
const { Events } = require("../constants")

/* eslint-disable */

exports.created = user => {
  const properties = {}
  events.processEvent(Events.USER_CREATED, properties)
}

exports.updated = user => {
  const properties = {}
  events.processEvent(Events.USER_UPDATED, properties)
}

exports.deleted = user => {
  const properties = {}
  events.processEvent(Events.USER_DELETED, properties)
}

// TODO
exports.passwordForceReset = user => {
  const properties = {}
  events.processEvent(Events.USER_PASSWORD_FORCE_RESET, properties)
}

// PERMISSIONS

exports.permissionAdminAssigned = user => {
  const properties = {}
  events.processEvent(Events.USER_PERMISSION_ADMIN_ASSIGNED, properties)
}

exports.permissionAdminRemoved = user => {
  const properties = {}
  events.processEvent(Events.USER_PERMISSION_ADMIN_REMOVED, properties)
}

exports.permissionBuilderAssigned = user => {
  const properties = {}
  events.processEvent(Events.USER_PERMISSION_BUILDER_ASSIGNED, properties)
}

exports.permissionBuilderRemoved = user => {
  const properties = {}
  events.processEvent(Events.USER_PERMISSION_BUILDER_REMOVED, properties)
}

// INVITE

// TODO
exports.invited = user => {
  const properties = {}
  events.processEvent(Events.USER_INVITED, properties)
}

// TODO
exports.inviteAccepted = user => {
  const properties = {}
  events.processEvent(Events.USER_INVITED_ACCEPTED, properties)
}

// SELF

// TODO
exports.selfUpdated = user => {
  const properties = {}
  events.processEvent(Events.USER_SELF_UPDATED, properties)
}

// TODO
exports.selfPasswordUpdated = user => {
  const properties = {}
  events.processEvent(Events.USER_SELF_PASSWORD_UPDATED, properties)
}

// TODO
exports.passwordResetRequested = user => {
  const properties = {}
  events.processEvent(Events.USER_PASSWORD_RESET_REQUESTED, properties)
}

// TODO
exports.passwordReset = user => {
  const properties = {}
  events.processEvent(Events.USER_PASSWORD_RESET, properties)
}
