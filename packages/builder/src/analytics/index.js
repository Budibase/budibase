import { API } from "api"
import PosthogClient from "./PosthogClient"
import IntercomClient from "./IntercomClient"
import { Events, EventSource } from "./constants"

const posthog = new PosthogClient(process.env.POSTHOG_TOKEN)
const intercom = new IntercomClient(process.env.INTERCOM_TOKEN)

class AnalyticsHub {
  constructor() {
    this.clients = [posthog, intercom]
  }

  async activate() {
    // Check analytics are enabled
    const analyticsStatus = await API.getAnalyticsStatus()
    if (analyticsStatus.enabled) {
      this.clients.forEach(client => client.init())
    }
  }

  identify(id) {
    posthog.identify(id)
  }

  captureException(err) {}

  captureEvent(eventName, props = {}) {
    posthog.captureEvent(eventName, props)
    intercom.captureEvent(eventName, props)
  }

  showChat(user) {
    intercom.show(user)
  }

  async logout() {
    posthog.logout()
    intercom.logout()
  }
}

const analytics = new AnalyticsHub()

export { Events, EventSource }
export default analytics
