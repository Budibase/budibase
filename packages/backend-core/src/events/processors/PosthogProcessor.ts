import PostHog from "posthog-node"
import { Event, Identity, Group } from "@budibase/types"
import { EventProcessor } from "./types"
import env from "../../environment"
const pkg = require("../../../package.json")

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
    properties.version = pkg.version
    properties.service = env.SERVICE
    const payload: any = { distinctId: identity.id, event, properties }
    if (timestamp) {
      payload.timestamp = new Date(timestamp)
    }

    // add groups to the event
    if (identity.installationId || identity.tenantId) {
      payload.groups = {}
      if (identity.installationId) {
        payload.groups.installation = identity.installationId
      }
      if (identity.tenantId) {
        payload.groups.tenant = identity.tenantId
      }
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

  async identifyGroup(group: Group, timestamp?: string | number) {
    const payload: any = {
      distinctId: group.id,
      groupType: group.type,
      groupKey: group.id,
      properties: group,
    }

    if (timestamp) {
      payload.timestamp = new Date(timestamp)
    }
    this.posthog.groupIdentify(payload)
  }

  shutdown() {
    this.posthog.shutdown()
  }
}
