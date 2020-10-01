import * as Sentry from "@sentry/browser"
import posthog from "posthog-js"
import api from "builderStore/api"

let analyticsEnabled
const posthogConfigured = process.env.POSTHOG_TOKEN && process.env.POSTHOG_URL
const sentryConfigured = process.env.SENTRY_DSN

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

export default {
  activate,
  identify,
  identifyByApiKey,
  captureException,
  captureEvent,
}
