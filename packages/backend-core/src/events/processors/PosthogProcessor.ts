import PostHog from "posthog-node"
import { Event } from "@budibase/types"
import { EventProcessor } from "./types"
import { getTenantId } from "../../context"

export default class PosthogProcessor implements EventProcessor {
  posthog: PostHog

  constructor(token: string | undefined) {
    if (!token) {
      throw new Error("Posthog token is not defined")
    }
    this.posthog = new PostHog(token)
  }

  processEvent(event: Event, properties: any): void {
    const userId = getTenantId() // TODO
    this.posthog.capture({ distinctId: userId, event, properties })
  }

  identify(distinctId: string, properties: any) {
    this.posthog.identify({ distinctId, properties })
  }

  shutdown() {
    this.posthog.shutdown()
  }
}
