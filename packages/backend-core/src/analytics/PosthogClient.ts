import PostHog from "posthog-node"
import { Event } from "@budibase/types"

class PosthogClient {
  posthog: PostHog

  constructor(token: string | undefined) {
    if (!token) {
      throw new Error("Posthog token is not defined")
    }
    this.posthog = new PostHog(token)
  }

  identify(distinctId: string, properties: any) {
    this.posthog.identify({ distinctId, properties })
  }

  capture(userId: string, event: Event, properties: any) {
    this.posthog.capture({ distinctId: userId, event, properties })
  }

  shutdown() {
    this.posthog.shutdown()
  }
}

export default PosthogClient
