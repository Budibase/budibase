import { Event, Group, Identity } from "@budibase/types"
import env from "../../environment"
import { EventProcessor } from "./types"

const skipLogging = env.SELF_HOSTED && !env.isDev()

export default class LoggingProcessor implements EventProcessor {
  async processEvent(
    event: Event,
    identity: Identity,
    properties: any
  ): Promise<void> {
    if (skipLogging) {
      return
    }
    console.log(`[audit] [identityType=${identity.type}] ${event}`, properties)
  }

  async identify(identity: Identity) {
    if (skipLogging) {
      return
    }
    console.log(`[audit] identified`, identity)
  }

  async identifyGroup(group: Group) {
    if (skipLogging) {
      return
    }
    console.log(`[audit] group identified`, group)
  }

  shutdown(): void {
    // no-op
  }
}
