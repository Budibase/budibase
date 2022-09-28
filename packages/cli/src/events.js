const AnalyticsClient = require("./analytics/Client")

const client = new AnalyticsClient()

exports.captureEvent = (event, properties) => {
  client.capture({
    distinctId: "cli",
    event,
    properties,
  })
}
