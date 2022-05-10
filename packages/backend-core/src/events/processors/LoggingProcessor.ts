import { Event } from "@budibase/types"
import { getTenantId } from "../../context"
import { EventProcessor } from "./types"

export default class LoggingProcessor implements EventProcessor {
  processEvent(event: Event, properties: any): void {
    const tenantId = getTenantId()
    const userId = getTenantId() // TODO
    console.log(`[audit] [tenant=${tenantId}] [user=${userId}] ${event}`)
  }

  shutdown(): void {
    // no-op
  }
}
