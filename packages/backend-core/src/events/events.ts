import { getTenantId } from "../context"
import analytics from "../analytics"
import { Event } from "@budibase/types"

const logEvent = (messsage: string) => {
  const tenantId = getTenantId()
  const userId = getTenantId() // TODO
  console.log(`[audit] [tenant=${tenantId}] [user=${userId}] ${messsage}`)
}

export const processEvent = (event: Event, properties: any) => {
  // logging
  logEvent(event)

  // analytics
  analytics.captureEvent(event, properties)
}
