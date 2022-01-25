const { Headers } = require("../constants")
const { buildMatcherRegex, matches } = require("./matchers")

/**
 * GET, HEAD and OPTIONS methods are considered safe operations
 *
 * POST, PUT, PATCH, and DELETE methods, being state changing verbs,
 * should have a CSRF token attached to the request
 */
const EXCLUDED_METHODS = ["GET", "HEAD", "OPTIONS"]

/**
 * Validate the CSRF token generated aganst the user session.
 * Compare the token with the x-csrf-token header.
 *
 * If the token is not found within the request or the value provided
 * does not match the value within the user session, the request is rejected.
 *
 * CSRF protection provided using the 'Synchronizer Token Pattern'
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern
 *
 */
module.exports = (opts = { noCsrfPatterns: [] }) => {
  const noCsrfOptions = buildMatcherRegex(opts.noCsrfPatterns)
  return async (ctx, next) => {
    // don't apply for excluded paths
    const found = matches(ctx, noCsrfOptions)
    if (found) {
      return next()
    }

    // don't apply for the excluded http methods
    if (EXCLUDED_METHODS.indexOf(ctx.method) !== -1) {
      return next()
    }

    // don't apply csrf when the internal api key has been used
    if (ctx.internal) {
      return next()
    }

    // reject if no token in session
    const userToken = ctx.user.csrfToken
    if (!userToken) {
      ctx.throw(403, "No CSRF token found")
    }

    // reject if no token in request or mismatch
    const requestToken = ctx.get(Headers.CSRF_TOKEN)
    if (!requestToken || requestToken !== userToken) {
      ctx.throw(403, "Invalid CSRF token")
    }

    return next()
  }
}
