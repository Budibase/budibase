import { Event, Identity } from "@budibase/types"
import { EventProcessor } from "./types"
import env from "../../environment"
import * as analytics from "../analytics"
import PosthogProcessor from "./PosthogProcessor"

export default class AnalyticsProcessor implements EventProcessor {
  posthog: PosthogProcessor | undefined

  constructor() {
    if (env.POSTHOG_TOKEN) {
      this.posthog = new PosthogProcessor(env.POSTHOG_TOKEN)
    }
  }

  async processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string | number
  ): Promise<void> {
    if (!(await analytics.enabled())) {
      return
    }
    if (this.posthog) {
      this.posthog.processEvent(event, identity, properties, timestamp)
    }
  }

  async identify(identity: Identity, timestamp?: string | number) {
    if (!(await analytics.enabled())) {
      return
    }
    if (this.posthog) {
      this.posthog.identify(identity, timestamp)
    }
  }

  shutdown() {
    if (this.posthog) {
      this.posthog.shutdown()
    }
  }
}
