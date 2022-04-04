const events = require("../events")
const { Events } = require("../constants")

exports.login = () => {
  const properties = {}
  events.processEvent(Events.AUTH_LOGIN, properties)
}

exports.logout = () => {
  const properties = {}
  events.processEvent(Events.AUTH_LOGOUT, properties)
}

exports.SSOCreated = type => {
  const properties = {
    type,
  }
  events.processEvent(Events.AUTH_SSO_CREATED, properties)
}

exports.SSOUpdated = type => {
  const properties = {
    type,
  }
  events.processEvent(Events.AUTH_SSO_UPDATED, properties)
}

exports.SSOActivated = type => {
  const properties = {
    type,
  }
  events.processEvent(Events.AUTH_SSO_ACTIVATED, properties)
}

exports.SSODeactivated = type => {
  const properties = {
    type,
  }
  events.processEvent(Events.AUTH_SSO_DEACTIVATED, properties)
}
