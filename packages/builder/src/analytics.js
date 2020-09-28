import * as Sentry from "@sentry/browser"
import posthog from "posthog-js"
import api from "builderStore/api"

function activate() {
  Sentry.init({ dsn: process.env.SENTRY_DSN })
  if (!process.env.POSTHOG_TOKEN) return
  posthog.init(process.env.POSTHOG_TOKEN, {
    api_host: process.env.POSTHOG_URL,
  })
}

function identify(id) {
  if (!id) return
  posthog.identify(id)
  Sentry.configureScope(scope => {
    scope.setUser({ id: id })
  })
}

async function identifyByApiKey(apiKey) {
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
  Sentry.captureException(err)
}

function captureEvent(event) {
  if (!process.env.POSTHOG_TOKEN) return
  posthog.capture(event)
}

export default {
  activate,
  identify,
  identifyByApiKey,
  captureException,
  captureEvent,
}
