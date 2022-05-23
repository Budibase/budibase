import { Event, Identity } from "@budibase/types"
import { EventProcessor } from "./types"

export default class LoggingProcessor implements EventProcessor {
  async processEvent(
    event: Event,
    identity: Identity,
    properties: any
  ): Promise<void> {
    console.log(
      `[audit] [tenant=${identity.tenantId}] [identity=${identity.id}] ${event}`
    )
  }

  shutdown(): void {
    // no-op
  }
}
