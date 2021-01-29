import * as Sentry from "@sentry/browser"
import posthog from "posthog-js"
import api from "builderStore/api"

let analyticsEnabled
const posthogConfigured = process.env.POSTHOG_TOKEN && process.env.POSTHOG_URL
const sentryConfigured = process.env.SENTRY_DSN

const FEEDBACK_SUBMITTED_KEY = "budibase:feedback_submitted"
const APP_FIRST_STARTED_KEY = "budibase:first_run"
const feedbackHours = 12

async function activate() {
  if (analyticsEnabled === undefined) {
    // only the server knows the true NODE_ENV
    // this was an issue as NODE_ENV = 'cypress' on the server,
    // but 'production' on the client
    const response = await api.get("/api/analytics")
    analyticsEnabled = (await response.json()) === true
  }
  if (!analyticsEnabled) return
  if (sentryConfigured) Sentry.init({ dsn: process.env.SENTRY_DSN })
  if (posthogConfigured) {
    posthog.init(process.env.POSTHOG_TOKEN, {
      api_host: process.env.POSTHOG_URL,
    })
    posthog.set_config({ persistence: "cookie" })
  }
}

function identify(id) {
  if (!analyticsEnabled || !id) return
  if (posthogConfigured) posthog.identify(id)
  if (sentryConfigured)
    Sentry.configureScope(scope => {
      scope.setUser({ id: id })
    })
}

async function identifyByApiKey(apiKey) {
  if (!analyticsEnabled) return true
  try {
    const response = await fetch(
      `https://03gaine137.execute-api.eu-west-1.amazonaws.com/prod/account/id?api_key=${apiKey.trim()}`
    )
    if (response.status === 200) {
      const id = await response.json()

      await api.put("/api/keys/userId", { value: id })
      identify(id)
      return true
    }

    return false
  } catch (error) {
    console.log(error)
  }
}

function captureException(err) {
  if (!analyticsEnabled) return
  Sentry.captureException(err)
  captureEvent("Error", { error: err.message ? err.message : err })
}

function captureEvent(eventName, props = {}) {
  if (!analyticsEnabled || !process.env.POSTHOG_TOKEN) return
  props.sourceApp = "builder"
  posthog.capture(eventName, props)
}

if (!localStorage.getItem(APP_FIRST_STARTED_KEY)) {
  localStorage.setItem(APP_FIRST_STARTED_KEY, Date.now())
}

const isFeedbackTimeElapsed = sinceDateStr => {
  const sinceDate = parseFloat(sinceDateStr)
  const feedbackMilliseconds = feedbackHours * 60 * 60 * 1000
  return Date.now() > sinceDate + feedbackMilliseconds
}
function submitFeedback(values) {
  if (!analyticsEnabled || !process.env.POSTHOG_TOKEN) return
  localStorage.setItem(FEEDBACK_SUBMITTED_KEY, Date.now())

  const prefixedValues = Object.entries(values).reduce((obj, [key, value]) => {
    obj[`feedback_${key}`] = value
    return obj
  }, {})

  posthog.capture("Feedback Submitted", prefixedValues)
}

function requestFeedbackOnDeploy() {
  if (!analyticsEnabled || !process.env.POSTHOG_TOKEN) return false
  const lastSubmittedStr = localStorage.getItem(FEEDBACK_SUBMITTED_KEY)
  if (!lastSubmittedStr) return true
  return isFeedbackTimeElapsed(lastSubmittedStr)
}

function highlightFeedbackIcon() {
  if (!analyticsEnabled || !process.env.POSTHOG_TOKEN) return false
  const lastSubmittedStr = localStorage.getItem(FEEDBACK_SUBMITTED_KEY)
  if (lastSubmittedStr) return isFeedbackTimeElapsed(lastSubmittedStr)
  const firstRunStr = localStorage.getItem(APP_FIRST_STARTED_KEY)
  if (!firstRunStr) return false
  return isFeedbackTimeElapsed(firstRunStr)
}

// Opt In/Out
const ifAnalyticsEnabled = func => () => {
  if (analyticsEnabled && process.env.POSTHOG_TOKEN) {
    return func()
  }
}
const disabled = () => posthog.has_opted_out_capturing()
const optIn = () => posthog.opt_in_capturing()
const optOut = () => posthog.opt_out_capturing()

export default {
  activate,
  identify,
  identifyByApiKey,
  captureException,
  captureEvent,
  requestFeedbackOnDeploy,
  submitFeedback,
  highlightFeedbackIcon,
  disabled: ifAnalyticsEnabled(disabled),
  optIn: ifAnalyticsEnabled(optIn),
  optOut: ifAnalyticsEnabled(optOut),
}
