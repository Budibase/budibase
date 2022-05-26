import { Event, Identity } from "@budibase/types"
import { EventProcessor } from "./types"
import env from "../../environment"

export default class LoggingProcessor implements EventProcessor {
  async processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string
  ): Promise<void> {
    if (env.SELF_HOSTED && !env.isDev()) {
      return
    }
    let timestampString = ""
    if (timestamp) {
      timestampString = `[timestamp=${new Date(timestamp).toISOString()}]`
    }

    console.log(
      `[audit] [tenant=${identity.tenantId}] [identityType=${identity.type}] [identity=${identity.id}] ${timestampString} ${event} `
    )
  }

  async identify(identity: Identity, timestamp?: string | number) {
    if (env.SELF_HOSTED && !env.isDev()) {
      return
    }

    let timestampString = ""
    if (timestamp) {
      timestampString = `[timestamp=${new Date(timestamp).toISOString()}]`
    }

    console.log(
      `[audit] [${JSON.stringify(identity)}] ${timestampString} identified`
    )
  }

  shutdown(): void {
    // no-op
  }
}
