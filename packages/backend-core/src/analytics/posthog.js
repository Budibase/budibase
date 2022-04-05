const PostHog = require("posthog-node")

class PosthogClient {
  constructor(token) {
    this.posthog = new PostHog(token)
  }

  identify(distinctId, properties) {
    this.posthog.identify({ distinctId, properties })
  }

  capture(userId, event, properties) {
    this.posthog.capture({ distinctId: userId, event, properties })
  }

  shutdown() {
    this.posthog.shutdown()
  }
}

module.exports = PosthogClient
