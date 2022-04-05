const events = require("../events")
const { Events } = require("../constants")

exports.login = source => {
  const properties = {
    source,
  }
  events.processEvent(Events.AUTH_LOGIN, properties)
}

exports.logout = () => {
  const properties = {}
  events.processEvent(Events.AUTH_LOGOUT, properties)
}

// TODO
exports.SSOCreated = type => {
  const properties = {
    type,
  }
  events.processEvent(Events.AUTH_SSO_CREATED, properties)
}

// TODO
exports.SSOUpdated = type => {
  const properties = {
    type,
  }
  events.processEvent(Events.AUTH_SSO_UPDATED, properties)
}

// TODO
exports.SSOActivated = type => {
  const properties = {
    type,
  }
  events.processEvent(Events.AUTH_SSO_ACTIVATED, properties)
}

// TODO
exports.SSODeactivated = type => {
  const properties = {
    type,
  }
  events.processEvent(Events.AUTH_SSO_DEACTIVATED, properties)
}
