import { getTenantId } from "../context"
import { captureEvent } from "../analytics"

const logEvent = messsage => {
  const tenantId = getTenantId()
  const userId = getTenantId() // TODO
  console.log(`[audit] [tenant=${tenantId}] [user=${userId}] ${messsage}`)
}

export const processEvent = (event, properties) => {
  // logging
  logEvent(event)

  // analytics
  captureEvent(event, properties)
}
