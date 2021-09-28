const { Cookies, Headers } = require("../constants")
const { getCookie, clearCookie } = require("../utils")
const { getUser } = require("../cache/user")
const { getSession, updateSessionTTL } = require("../security/sessions")
const { buildMatcherRegex, matches } = require("./matchers")
const env = require("../environment")

function finalise(
  ctx,
  { authenticated, user, internal, version, publicEndpoint } = {}
) {
  ctx.publicEndpoint = publicEndpoint || false
  console.log("Temp Auth Middleware: public endoint", ctx.publicEndpoint)
  ctx.isAuthenticated = authenticated || false
  console.log("Temp Auth Middleware: isAuthenticated", ctx.isAuthenticated)
  ctx.user = user
  console.log("Temp Auth Middleware: user", ctx.user)
  ctx.internal = internal || false
  console.log("Temp Auth Middleware: internal", ctx.internal)
  ctx.version = version
  console.log("Temp Auth Middleware: version", ctx.version)
}

/**
 * This middleware is tenancy aware, so that it does not depend on other middlewares being used.
 * The tenancy modules should not be used here and it should be assumed that the tenancy context
 * has not yet been populated.
 */
module.exports = (
  noAuthPatterns = [],
  opts = { publicAllowed: false, populateUser: null }
) => {
  const noAuthOptions = noAuthPatterns ? buildMatcherRegex(noAuthPatterns) : []
  return async (ctx, next) => {
    console.log("Temp Auth Middleware: Start auth middleware")
    let publicEndpoint = false
    const version = ctx.request.headers[Headers.API_VER]
    // the path is not authenticated
    const found = matches(ctx, noAuthOptions)
    if (found) {
      console.log("Temp Auth Middleware: Public endpoint found")
      publicEndpoint = true
    }
    try {
      console.log("Temp Auth Middleware: Parsing cookie")
      // check the actual user is authenticated first
      const authCookie = getCookie(ctx, Cookies.Auth)
      let authenticated = false,
        user = null,
        internal = false
      if (authCookie) {
        console.log("Temp Auth Middleware: Auth cookie found")
        let error = null
        const sessionId = authCookie.sessionId,
          userId = authCookie.userId
        console.log("Temp Auth Middleware: Getting session")
        const session = await getSession(userId, sessionId)
        if (!session) {
          error = "No session found"
        } else {
          try {
            console.log("Temp Auth Middleware: Getting user")
            if (opts && opts.populateUser) {
              console.log("Temp Auth Middleware: Populate user function found")
              user = await getUser(
                userId,
                session.tenantId,
                opts.populateUser(ctx)
              )
            } else {
              console.log("Temp Auth Middleware: Getting user from DB")
              user = await getUser(userId, session.tenantId)
            }
            delete user.password
            console.log("Temp Auth Middleware: User is authenticated")
            authenticated = true
          } catch (err) {
            console.log("Temp Auth Middleware: Holy shit there was an error")
            error = err
          }
        }
        if (error) {
          console.error("Auth Error", error)
          // remove the cookie as the user does not exist anymore
          clearCookie(ctx, Cookies.Auth)
        } else {
          console.log("Temp Auth Middleware: No error")
          // make sure we denote that the session is still in use
          await updateSessionTTL(session)
        }
      }
      const apiKey = ctx.request.headers[Headers.API_KEY]
      const tenantId = ctx.request.headers[Headers.TENANT_ID]
      // this is an internal request, no user made it
      if (!authenticated && apiKey && apiKey === env.INTERNAL_API_KEY) {
        authenticated = true
        internal = true
      }
      if (!user && tenantId) {
        user = { tenantId }
      }
      // be explicit
      if (authenticated !== true) {
        authenticated = false
      }
      console.log("Temp Auth Middleware: Auth status", {
        authenticated,
        user,
        internal,
        version,
        publicEndpoint,
      })
      // isAuthenticated is a function, so use a variable to be able to check authed state
      finalise(ctx, { authenticated, user, internal, version, publicEndpoint })
      return next()
    } catch (err) {
      console.log("Temp Auth Middleware: Error:", err)
      // allow configuring for public access
      if ((opts && opts.publicAllowed) || publicEndpoint) {
        finalise(ctx, { authenticated: false, version, publicEndpoint })
      } else {
        console.log("Temp Auth Middleware: Throwing error status", err.status)
        ctx.throw(err.status || 403, err)
      }
    }
  }
}
