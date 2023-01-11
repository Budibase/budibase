import { Event, Identity, Group } from "@budibase/types"
import { EventProcessor } from "./types"
import env from "../../environment"

const getTimestampString = (timestamp?: string | number) => {
  let timestampString = ""
  if (timestamp) {
    timestampString = `[timestamp=${new Date(timestamp).toISOString()}]`
  }
  return timestampString
}

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
    let timestampString = getTimestampString(timestamp)
    let message = `[audit] [identityType=${identity.type}] ${timestampString} ${event} `
    if (env.isDev()) {
      message = message + `[debug: [properties=${JSON.stringify(properties)}] ]`
    }
    console.log(message)
  }

  async identify(identity: Identity, timestamp?: string | number) {
    if (skipLogging) {
      return
    }
    let timestampString = getTimestampString(timestamp)
    console.log(
      `[audit] [${JSON.stringify(identity)}] ${timestampString} identified`
    )
  }

  async identifyGroup(group: Group, timestamp?: string | number) {
    if (skipLogging) {
      return
    }
    let timestampString = getTimestampString(timestamp)
    console.log(
      `[audit] [${JSON.stringify(group)}] ${timestampString} group identified`
    )
  }

  shutdown(): void {
    // no-op
  }
}
