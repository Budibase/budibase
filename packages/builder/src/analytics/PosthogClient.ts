import posthog from "posthog-js"

export default class PosthogClient {
  token: string
  initialised: boolean

  constructor(token: string) {
    this.token = token
    this.initialised = false
  }

  init() {
    if (!this.token) return

    posthog.init(this.token, {
      autocapture: false,
      capture_pageview: false,
      // disable by default
      disable_session_recording: true,
    })
    posthog.set_config({ persistence: "cookie" })

    this.initialised = true
  }

  /**
   * Set the posthog context to the current user
   * @param {String} id - unique user id
   */
  identify(id: string) {
    if (!this.initialised) return

    posthog.identify(id)
  }

  /**
   * Update user metadata associated with current user in posthog
   * @param {Object} meta - user fields
   */
  updateUser(meta: Record<string, any>) {
    if (!this.initialised) return

    posthog.people.set(meta)
  }

  /**
   * Capture analytics events and send them to posthog.
   * @param {String} event - event identifier
   * @param {Object} props - properties for the event
   */
  captureEvent(event: string, props: Record<string, any>) {
    if (!this.initialised) {
      return
    }

    props.sourceApp = "builder"
    posthog.capture(event, props)
  }

  enableSessionRecording() {
    if (!this.initialised) {
      return
    }
    posthog.set_config({
      disable_session_recording: false,
    })
  }

  /**
   * Reset posthog user back to initial state on logout.
   */
  logout() {
    if (!this.initialised) return

    posthog.reset()
  }
}
