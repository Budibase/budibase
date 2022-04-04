const events = require("../events")
const { Events } = require("../constants")

// TODO
exports.created = () => {
  const properties = {}
  events.processEvent(Events.USER_CREATED, properties)
}

// TODO
exports.updated = () => {
  const properties = {}
  events.processEvent(Events.USER_UPDATED, properties)
}

exports.deleted = () => {
  const properties = {}
  events.processEvent(Events.USER_DELETED, properties)
}

// TODO
exports.passwordForceReset = () => {
  const properties = {}
  events.processEvent(Events.USER_PASSWORD_FORCE_RESET, properties)
}

// PERMISSIONS

// TODO
exports.permissionAdminAssigned = () => {
  const properties = {}
  events.processEvent(Events.USER_PERMISSION_ADMIN_ASSIGNED, properties)
}

// TODO
exports.permissionAdminRemoved = () => {
  const properties = {}
  events.processEvent(Events.USER_PERMISSION_ADMIN_REMOVED, properties)
}

// TODO
exports.permissionBuilderAssigned = () => {
  const properties = {}
  events.processEvent(Events.USER_PERMISSION_BUILDER_ASSIGNED, properties)
}

// TODO
exports.permissionBuilderRemoved = () => {
  const properties = {}
  events.processEvent(Events.USER_PERMISSION_BUILDER_REMOVED, properties)
}

// INVITE

exports.invited = () => {
  const properties = {}
  events.processEvent(Events.USER_INVITED, properties)
}

exports.inviteAccepted = () => {
  const properties = {}
  events.processEvent(Events.USER_INVITED_ACCEPTED, properties)
}

// SELF

exports.selfUpdated = () => {
  const properties = {}
  events.processEvent(Events.USER_SELF_UPDATED, properties)
}

exports.selfPasswordUpdated = () => {
  const properties = {}
  events.processEvent(Events.USER_SELF_PASSWORD_UPDATED, properties)
}

exports.passwordResetRequested = () => {
  const properties = {}
  events.processEvent(Events.USER_PASSWORD_RESET_REQUESTED, properties)
}

exports.passwordReset = () => {
  const properties = {}
  events.processEvent(Events.USER_PASSWORD_RESET, properties)
}
