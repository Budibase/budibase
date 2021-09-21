import posthog from "posthog-js"
import { Events } from "./constants"

export default class PosthogClient {
  constructor(token, url) {
    this.token = token
    this.url = url
  }

  init() {
    if (!this.token || !this.url) return

    posthog.init(this.token, {
      autocapture: false,
      capture_pageview: false,
      api_host: this.url,
    })
    posthog.set_config({ persistence: "cookie" })

    this.initialised = true
  }

  identify(id) {
    if (!this.initialised) return

    posthog.identify(id)
  }

  updateUser(meta) {
    if (!this.initialised) return

    posthog.people.set(meta)
  }

  captureException(err) {
    if (!this.initialised) return

    this.captureEvent("Error", { error: err.message ? err.message : err })
  }

  captureEvent(eventName, props) {
    if (!this.initialised) return

    props.sourceApp = "builder"
    posthog.capture(eventName, props)
  }

  npsFeedback(values) {
    if (!this.initialised) return

    localStorage.setItem(Events.NPS.SUBMITTED, Date.now())

    const prefixedFeedback = {}
    for (let key in values) {
      prefixedFeedback[`feedback_${key}`] = values[key]
    }

    posthog.capture(Events.NPS.SUBMITTED, prefixedFeedback)
  }

  logout() {
    if (!this.initialised) return

    posthog.reset()
  }
}
