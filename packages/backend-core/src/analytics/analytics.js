const PosthogClient = require("./posthog")
const env = require("../environment")

class Analytics {
  constructor() {
    // check enabled before init
    this.isEnabled = !!(!env.SELF_HOSTED && env.ENABLE_ANALYTICS)
    if (!this.isEnabled) return

    this.posthog = new PosthogClient(process.env.POSTHOG_TOKEN)
  }

  enabled() {
    return this.isEnabled
  }

  updateUser(userId, properties) {
    if (!this.isEnabled) return
    this.posthog.updateUser(userId, properties)
  }

  captureEvent(eventName, properties) {
    if (!this.isEnabled) return
    // TODO: get the user id from context
    const userId = "TESTING_USER_ID"
    this.posthog.capture(userId, eventName, properties)
  }

  shutdown() {
    if (!this.isEnabled) return
    this.posthog.shutdown()
  }
}

module.exports = Analytics
