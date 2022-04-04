const events = require("../events")
const { Events } = require("../constants")

exports.SMTPCreated = () => {
  const properties = {}
  events.processEvent(Events.EMAIL_SMTP_CREATED, properties)
}

exports.SMTPUpdated = () => {
  const properties = {}
  events.processEvent(Events.EMAIL_SMTP_UPDATED, properties)
}
