import { Event, Identity, Group } from "@budibase/types"
import { EventProcessor } from "./types"
import env from "../../environment"

const skipLogging = env.SELF_HOSTED && !env.isDev()

export default class LoggingProcessor implements EventProcessor {
  async processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string
  ): Promise<void> {
    if (skipLogging) {
      return
    }
    console.log(`[audit] [identityType=${identity.type}] ${event}`, properties)
  }

  async identify(identity: Identity, timestamp?: string | number) {
    if (skipLogging) {
      return
    }
    console.log(`[audit] identified`, identity)
  }

  async identifyGroup(group: Group, timestamp?: string | number) {
    if (skipLogging) {
      return
    }
    console.log(`[audit] group identified`, group)
  }

  shutdown(): void {
    // no-op
  }
}
