import api from "builderStore/api"
import PosthogClient from "./PosthogClient"
import IntercomClient from "./IntercomClient"
import SentryClient from "./SentryClient"
import { Events } from "./constants"

// const posthog = new PosthogClient(
//   process.env.POSTHOG_TOKEN,
//   process.env.POSTHOG_URL
// )
const posthog = new PosthogClient(
  "phc_yGOn4i7jWKaCTapdGR6lfA4AvmuEQ2ijn5zAVSFYPlS",
  "https://app.posthog.com"
)
// const sentry = new SentryClient(process.env.SENTRY_DSN)
const sentry = new SentryClient("https://a34ae347621946bf8acded18e5b7d4b8@o420233.ingest.sentry.io/5338131")
// const intercom = new IntercomClient(process.env.INTERCOM_TOKEN)
const intercom = new IntercomClient("qz2sxfuv")


class AnalyticsHub {
  constructor() {
    this.clients = [posthog, sentry, intercom]
  }

  async activate() {
    const analyticsStatus = await api.get("/api/analytics")
    const json = await analyticsStatus.json()

    if (json.enabled) {
      this.clients.forEach(client => client.init())
    }

    this.enabled = json.enabled
  }

  optIn() {
    this.captureEvent(Events.ANALYTICS.OPT_IN)
    this.clients.forEach(client => client.optIn())
  }

  optOut() {
    this.captureEvent(Events.ANALYTICS.OPT_OUT)
    this.clients.forEach(client => client.optOut())
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
}

const analytics = new AnalyticsHub()

export { Events }
export default analytics