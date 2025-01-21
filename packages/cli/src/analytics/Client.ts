import { PostHog } from "posthog-node"
import { POSTHOG_TOKEN, AnalyticsEvent } from "../constants"
import { ConfigManager } from "../structures/ConfigManager"

export class AnalyticsClient {
  client: PostHog
  configManager: ConfigManager

  constructor() {
    this.client = new PostHog(POSTHOG_TOKEN, {})
    this.configManager = new ConfigManager()
  }

  capture(event: { distinctId: string; event: string; properties?: any }) {
    if (this.configManager.config.analyticsDisabled) return

    this.client.capture(event)
  }

  enable() {
    this.configManager.removeKey("analyticsDisabled")
    this.client.capture({ event: AnalyticsEvent.OptIn, distinctId: "cli" })
  }

  disable() {
    this.client.capture({ event: AnalyticsEvent.OptOut, distinctId: "cli" })
    this.configManager.setValue("analyticsDisabled", true)
  }

  status() {
    return this.configManager.config.analyticsDisabled ? "disabled" : "enabled"
  }
}
