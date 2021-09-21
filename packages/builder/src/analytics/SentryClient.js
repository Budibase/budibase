import * as Sentry from "@sentry/browser"

export default class SentryClient {
  constructor(dsn) {
    this.dsn = dsn
  }

  init() {
    if (this.dsn) {
      Sentry.init({ dsn: this.dsn })

      this.initalised = true
    }
  }

  captureException(err) {
    if (!this.initalised) return

    Sentry.captureException(err)
  }

  identify(id) {
    Sentry.configureScope(scope => {
      scope.setUser({ id })
    })
  }
}

// export function init() {
//   if (process.env.SENTRY_DSN) {
//     Sentry.init({ dsn: process.env.SENTRY_DSN })
//   }
// }

// export function captureException(err) {
//   // if (!analyticsEnabled) return
//   Sentry.captureException(err)
//   // captureEvent("Error", { error: err.message ? err.message : err })
// }
