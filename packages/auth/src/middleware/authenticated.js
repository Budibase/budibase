const { Cookies, Headers } = require("../constants")
const { getCookie, clearCookie } = require("../utils")
const { getUser } = require("../cache/user")
const { doInTenant } = require("../tenancy")
const { getSession, updateSessionTTL } = require("../security/sessions")
const env = require("../environment")
const { buildMatcherRegex, matches } = require("./matchers")

function finalise(ctx, { authenticated, user, internal, version } = {}) {
  ctx.isAuthenticated = authenticated || false
  ctx.user = user
  ctx.internal = internal || false
  ctx.version = version
}

module.exports = (noAuthPatterns = [], opts) => {
  const noAuthOptions = noAuthPatterns ? buildMatcherRegex(noAuthPatterns) : []
  return async (ctx, next) => {
    const version = ctx.request.headers[Headers.API_VER]
    // the path is not authenticated
    const found = matches(ctx, noAuthOptions)
    if (found) {
      return next()
    }
    try {
      // check the actual user is authenticated first
      const authCookie = getCookie(ctx, Cookies.Auth)
      let authenticated = false,
        user = null,
        internal = false
      if (authCookie) {
        let error = null
        const sessionId = authCookie.sessionId,
          userId = authCookie.userId
        const session = await getSession(userId, sessionId)
        if (!session) {
          error = "No session found"
        } else {
          try {
            user = await doInTenant(session.tenantId, async () => {
              return await getUser(userId)
            })
            delete user.password
            authenticated = true
          } catch (err) {
            error = err
          }
        }
        if (error) {
          // remove the cookie as the user does not exist anymore
          clearCookie(ctx, Cookies.Auth)
        } else {
          // make sure we denote that the session is still in use
          await updateSessionTTL(session)
        }
      }
      const apiKey = ctx.request.headers[Headers.API_KEY]
      // this is an internal request, no user made it
      if (!authenticated && apiKey && apiKey === env.INTERNAL_API_KEY) {
        authenticated = true
        internal = true
      }
      // be explicit
      if (authenticated !== true) {
        authenticated = false
      }
      // isAuthenticated is a function, so use a variable to be able to check authed state
      finalise(ctx, { authenticated, user, internal, version })
      return next()
    } catch (err) {
      // allow configuring for public access
      if (opts && opts.publicAllowed) {
        finalise(ctx, { authenticated: false, version })
      } else {
        ctx.throw(err.status || 403, err)
      }
    }
  }
}
