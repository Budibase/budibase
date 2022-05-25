import PostHog from "posthog-node"
import { Event, Identity } from "@budibase/types"
import { EventProcessor } from "./types"

export default class PosthogProcessor implements EventProcessor {
  posthog: PostHog

  constructor(token: string | undefined) {
    if (!token) {
      throw new Error("Posthog token is not defined")
    }
    this.posthog = new PostHog(token)
  }

  async processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string | number
  ): Promise<void> {
    const payload: any = { distinctId: identity.id, event, properties }
    if (timestamp) {
      payload.timestamp = new Date(timestamp)
    }
    this.posthog.capture(payload)
  }

  async identify(identity: Identity, timestamp?: string | number) {
    const payload: any = { distinctId: identity.id, properties: identity }
    if (timestamp) {
      payload.timestamp = new Date(timestamp)
    }
    this.posthog.identify(payload)
  }

  shutdown() {
    this.posthog.shutdown()
  }
}
