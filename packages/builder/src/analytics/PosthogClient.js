import posthog from "posthog-js"
import { Events } from "./constants"

// let analyticsEnabled
// const posthogConfigured = process.env.POSTHOG_TOKEN && process.env.POSTHOG_URL

// const FEEDBACK_SUBMITTED_KEY = "budibase:feedback_submitted"
// const APP_FIRST_STARTED_KEY = "budibase:first_run"
// const feedbackHours = 12

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

  disabled() {
    return posthog.has_opted_out_capturing()
  }

  optIn() {
    return posthog.opt_in_capturing()
  }

  optOut() {
    return posthog.opt_out_capturing()
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
}

// function captureEvent(eventName, props = {}) {
//   if (!analyticsEnabled || !process.env.POSTHOG_TOKEN) return
//   props.sourceApp = "builder"
//   posthog.capture(eventName, props)
// }

// if (!localStorage.getItem(APP_FIRST_STARTED_KEY)) {
//   localStorage.setItem(APP_FIRST_STARTED_KEY, Date.now())
// }

// function submitFeedback(values) {
//   if (!analyticsEnabled || !process.env.POSTHOG_TOKEN) return
//   localStorage.setItem(FEEDBACK_SUBMITTED_KEY, Date.now())

//   const prefixedValues = Object.entries(values).reduce((obj, [key, value]) => {
//     obj[`feedback_${key}`] = value
//     return obj
//   }, {})

//   posthog.capture("Feedback Submitted", prefixedValues)
// }

// function requestFeedbackOnDeploy() {
//   if (!analyticsEnabled || !process.env.POSTHOG_TOKEN) return false
//   const lastSubmittedStr = localStorage.getItem(FEEDBACK_SUBMITTED_KEY)
//   if (!lastSubmittedStr) return true
//   return isFeedbackTimeElapsed(lastSubmittedStr)
// }

// function highlightFeedbackIcon() {
//   if (!analyticsEnabled || !process.env.POSTHOG_TOKEN) return false
//   const lastSubmittedStr = localStorage.getItem(FEEDBACK_SUBMITTED_KEY)
//   if (lastSubmittedStr) return isFeedbackTimeElapsed(lastSubmittedStr)
//   const firstRunStr = localStorage.getItem(APP_FIRST_STARTED_KEY)
//   if (!firstRunStr) return false
//   return isFeedbackTimeElapsed(firstRunStr)
// }

// Opt In/Out
// const ifAnalyticsEnabled = func => () => {
//   if (analyticsEnabled && process.env.POSTHOG_TOKEN) {
//     return func()
//   }
// }
// const disabled = () => posthog.has_opted_out_capturing()
// const optIn = () => posthog.opt_in_capturing()
// const optOut = () => posthog.opt_out_capturing()

// export default {
// init,
// identify,
// captureException,
// captureEvent,
// submitFeedback,
// highlightFeedbackIcon,
// disabled: () => {
//   if (analyticsEnabled == null) {
//     return true
//   }
//   return ifAnalyticsEnabled(disabled)
// },
// optIn: ifAnalyticsEnabled(optIn),
// optOut: ifAnalyticsEnabled(optOut),
// }
