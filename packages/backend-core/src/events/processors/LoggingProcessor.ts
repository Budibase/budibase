import { Event, Identity } from "@budibase/types"
import { EventProcessor } from "./types"
import env from "../../environment"

export default class LoggingProcessor implements EventProcessor {
  async processEvent(
    event: Event,
    identity: Identity,
    properties: any
  ): Promise<void> {
    if (env.SELF_HOSTED && !env.isDev()) {
      return
    }
    console.log(
      `[audit] [tenant=${identity.tenantId}] [identityType=${identity.type}] [identity=${identity.id}] ${event}`
    )
  }

  shutdown(): void {
    // no-op
  }
}
