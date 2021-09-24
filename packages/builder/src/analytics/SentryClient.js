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

  /**
   * Capture an exception and send it to sentry.
   * @param {Error} err - JS error object
   */
  captureException(err) {
    if (!this.initalised) return

    Sentry.captureException(err)
  }

  /**
   * Identify user in sentry.
   * @param {String} id - Unique user id
   */
  identify(id) {
    if (!this.initalised) return

    Sentry.configureScope(scope => {
      scope.setUser({ id })
    })
  }
}
