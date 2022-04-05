const PosthogClient = require("./posthog")
const env = require("../environment")
const { getTenantId } = require("../context")

const IdentityType = {
  TENANT: "tenant",
  USER: "user",
  ACCOUNT: "account",
}

const Hosting = {
  CLOUD: "cloud",
  SELF: "self",
}

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

  identify(type, id, hosting) {
    if (!this.isEnabled) return
    const tenantId = getTenantId()
    if (!hosting) {
      hosting = env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
    }
    const properties = {
      type,
      hosting,
      tenant: tenantId,
    }
    this.posthog.identify(id, properties)
  }

  identifyUser(userId) {
    this.identify(IdentityType.USER, userId)
  }

  identifyTenant() {
    let distinctId
    if (env.SELF_HOSTED) {
      distinctId = getTenantId() // TODO: Get installation ID
    } else {
      distinctId = getTenantId()
    }
    this.identify(IdentityType.TENANT, distinctId)
  }

  identifyAccount(account) {
    const distinctId = account.accountId
    const hosting = account.hosting
    this.identify(IdentityType.ACCOUNT, distinctId, hosting)
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
