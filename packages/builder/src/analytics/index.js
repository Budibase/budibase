import { API } from "@/api"
import PosthogClient from "./PosthogClient"
import { Events, EventSource } from "./constants"

const posthog = new PosthogClient(process.env.POSTHOG_TOKEN)

class AnalyticsHub {
  constructor() {
    this.clients = [posthog]
    this.initialised = false
  }

  async activate() {
    // Check analytics are enabled
    const analyticsStatus = await API.getAnalyticsStatus()
    if (analyticsStatus.enabled && !this.initialised) {
      this.clients.forEach(client => {
        client.init()
      })
      this.initialised = true
    }
  }

  identify(id) {
    posthog.identify(id)
  }

  captureException(_err) {}

  captureEvent(eventName, props = {}) {
    posthog.captureEvent(eventName, props)
  }

  async logout() {
    posthog.logout()
  }
}

const analytics = new AnalyticsHub()

export { Events, EventSource }
export default analytics
