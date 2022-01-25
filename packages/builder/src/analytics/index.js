import { API } from "api"
import PosthogClient from "./PosthogClient"
import IntercomClient from "./IntercomClient"
import SentryClient from "./SentryClient"
import { Events } from "./constants"

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
    // Check analytics are enabled
    const analyticsStatus = await API.getAnalyticsStatus()
    if (analyticsStatus.enabled) {
      this.clients.forEach(client => client.init())
    }
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
