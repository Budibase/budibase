const { getTenantId } = require("../context")
const analytics = require("../analytics")

const logEvent = messsage => {
  const tenantId = getTenantId()
  const userId = getTenantId() // TODO
  console.log(`[audit] [tenant=${tenantId}] [user=${userId}] ${messsage}`)
}

exports.processEvent = (event, properties) => {
  // logging
  logEvent(event)

  // analytics
  analytics.captureEvent(event, properties)
}
