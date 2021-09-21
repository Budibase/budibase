import api from "builderStore/api"
import PosthogClient from "./PosthogClient"
import IntercomClient from "./IntercomClient"
import SentryClient from "./SentryClient"
import { Events } from "./constants"
import { auth } from "stores/portal"
import { get } from "svelte/store"

const posthog = new PosthogClient(
  process.env.POSTHOG_TOKEN,
  process.env.POSTHOG_URL
)
const sentry = new SentryClient(process.env.SENTRY_DSN)
const intercom = new IntercomClient(process.env.INTERCOM_TOKEN)

class AnalyticsHub {
  constructor() {
    this.clients = [posthog, sentry, intercom]
  }

  async activate() {
    // Setting the analytics env var off in the backend overrides org/tenant settings
    const analyticsStatus = await api.get("/api/analytics")
    const json = await analyticsStatus.json()

    // Multitenancy disabled on the backend
    if (!json.enabled) return

    const tenantId = get(auth).tenantId

    if (tenantId) {
      const res = await api.get(
        `/api/global/configs/public?tenantId=${tenantId}`
      )
      const orgJson = await res.json()

      // analytics opted out for the tenant
      if (orgJson.config?.analytics === false) return
    }

    this.clients.forEach(client => client.init())
    this.enabled = true
  }

  identify(id, metadata) {
    posthog.identify(id)
    if (metadata) {
      posthog.updateUser(metadata)
    }
    sentry.identify(id)
  }

  captureException(err) {
    sentry.captureException(err)
  }

  captureEvent(eventName, props = {}) {
    posthog.captureEvent(eventName, props)
    intercom.captureEvent(eventName, props)
  }

  showChat(user) {
    intercom.show(user)
  }

  submitFeedback(values) {
    posthog.npsFeedback(values)
  }

  async logout() {
    posthog.logout()
    intercom.logout()
  }
}

const analytics = new AnalyticsHub()

export { Events }
export default analytics
