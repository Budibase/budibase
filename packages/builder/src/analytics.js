import * as Sentry from "@sentry/browser"
import posthog from "posthog-js"
import api from "builderStore/api"

let analyticsEnabled

async function activate() {
  if (analyticsEnabled === undefined) {
    // only the server knows the true NODE_ENV
    // this was an issue as NODE_ENV = 'cypress' on the server,
    // but 'production' on the client
    const response = await api.get("/api/analytics")
    analyticsEnabled = (await response.json()) === true
  }
  if (!analyticsEnabled) return
  Sentry.init({ dsn: process.env.SENTRY_DSN })
  if (!process.env.POSTHOG_TOKEN) return
  posthog.init(process.env.POSTHOG_TOKEN, {
    api_host: process.env.POSTHOG_URL,
  })
  posthog.set_config({ persistence: "cookie" })
}

function identify(id) {
  if (!analyticsEnabled) return
  if (!id) return
  posthog.identify(id)
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
