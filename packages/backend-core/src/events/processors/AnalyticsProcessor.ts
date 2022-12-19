import { Event, Identity, Group, IdentityType } from "@budibase/types"
import { EventProcessor } from "./types"
import env from "../../environment"
import * as analytics from "../analytics"
import PosthogProcessor from "./posthog"

/**
 * Events that are always captured.
 */
const EVENT_WHITELIST = [
  Event.INSTALLATION_VERSION_UPGRADED,
  Event.INSTALLATION_VERSION_DOWNGRADED,
]
const IDENTITY_WHITELIST = [IdentityType.INSTALLATION, IdentityType.TENANT]

export default class AnalyticsProcessor implements EventProcessor {
  posthog: PosthogProcessor | undefined

  constructor() {
    if (env.POSTHOG_TOKEN && !env.isTest()) {
      this.posthog = new PosthogProcessor(env.POSTHOG_TOKEN)
    }
  }

  async processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string | number
  ): Promise<void> {
    if (!EVENT_WHITELIST.includes(event) && !(await analytics.enabled())) {
      return
    }
    if (this.posthog) {
      await this.posthog.processEvent(event, identity, properties, timestamp)
    }
  }

  async identify(identity: Identity, timestamp?: string | number) {
    // Group indentifications (tenant and installation) always on
    if (
      !IDENTITY_WHITELIST.includes(identity.type) &&
      !(await analytics.enabled())
    ) {
      return
    }
    if (this.posthog) {
      await this.posthog.identify(identity, timestamp)
    }
  }

  async identifyGroup(group: Group, timestamp?: string | number) {
    // Group indentifications (tenant and installation) always on
    if (this.posthog) {
      await this.posthog.identifyGroup(group, timestamp)
    }
  }

  shutdown() {
    if (this.posthog) {
      this.posthog.shutdown()
    }
  }
}
