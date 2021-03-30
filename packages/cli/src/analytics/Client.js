const PostHog = require("posthog-node")
const path = require("path")
const fs = require("fs")
const os = require("os")
const { BUDIBASE_POSTHOG_URL, BUDIBASE_POSTHOG_TOKEN, AnalyticsEvents } = require("../constants")
const ConfigManager = require("../structures/ConfigManager")

class AnalyticsClient {
  constructor() {
    this.client = new PostHog(BUDIBASE_POSTHOG_TOKEN, { host: BUDIBASE_POSTHOG_URL })
    this.configManager = new ConfigManager()
  }

  capture(event) {
    if (this.manager.config.analyticsDisabled) return

    this.client.capture(event)
  }

  enable() {
    this.configManager.removeKey("analyticsDisabled")
    this.client.capture({ event: AnalyticsEvents.OptIn, distinctId: "cli" })
  }

  disable() {
    this.client.capture({ event: AnalyticsEvents.OptOut, distinctId: "cli" })
    this.configManager.setValue("analyticsDisabled", true)
  }

  status() {
    return this.configManager.config.analyticsDisabled ? "disabled" : "enabled"
  }
}

module.exports = AnalyticsClient