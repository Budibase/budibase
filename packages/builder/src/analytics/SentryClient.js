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
    if (!this.initalised) return

    Sentry.configureScope(scope => {
      scope.setUser({ id })
    })
  }
}
