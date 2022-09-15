import posthog from "posthog-js"
import { Events } from "./constants"

export default class PosthogClient {
  constructor(token) {
    this.token = token
  }

  init() {
    if (!this.token) return

    posthog.init(this.token, {
      autocapture: false,
      capture_pageview: false,
    })
    posthog.set_config({ persistence: "cookie" })

    this.initialised = true
  }

  /**
   * Set the posthog context to the current user
   * @param {String} id - unique user id
   */
  identify(id) {
    if (!this.initialised) return

    posthog.identify(id)
  }

  /**
   * Update user metadata associated with current user in posthog
   * @param {Object} meta - user fields
   */
  updateUser(meta) {
    if (!this.initialised) return

    posthog.people.set(meta)
  }

  /**
   * Capture analytics events and send them to posthog.
   * @param {String} event - event identifier
   * @param {Object} props - properties for the event
   */
  captureEvent(eventName, props) {
    if (!this.initialised) return

    props.sourceApp = "builder"
    posthog.capture(eventName, props)
  }

  /**
   * Submit NPS feedback to posthog.
   * @param {Object} values - NPS Values
   */
  npsFeedback(values) {
    if (!this.initialised) return

    localStorage.setItem(Events.NPS.SUBMITTED, Date.now())

    const prefixedFeedback = {}
    for (let key in values) {
      prefixedFeedback[`feedback_${key}`] = values[key]
    }

    posthog.capture(Events.NPS.SUBMITTED, prefixedFeedback)
  }

  /**
   * Reset posthog user back to initial state on logout.
   */
  logout() {
    if (!this.initialised) return

    posthog.reset()
  }
}
