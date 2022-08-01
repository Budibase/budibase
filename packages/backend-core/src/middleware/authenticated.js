const { Cookies, Headers } = require("../constants")
const { getCookie, clearCookie, openJwt } = require("../utils")
const { getUser } = require("../cache/user")
const { getSession, updateSessionTTL } = require("../security/sessions")
const { buildMatcherRegex, matches } = require("./matchers")
const env = require("../environment")
const { SEPARATOR } = require("../db/constants")
const { ViewNames } = require("../db/utils")
const { queryGlobalView } = require("../db/views")
const { getGlobalDB, doInTenant } = require("../tenancy")
const { decrypt } = require("../security/encryption")
const identity = require("../context/identity")

function finalise(
  ctx,
  { authenticated, user, internal, version, publicEndpoint } = {}
) {
  ctx.publicEndpoint = publicEndpoint || false
  ctx.isAuthenticated = authenticated || false
  ctx.user = user
  ctx.internal = internal || false
  ctx.version = version
}

async function checkApiKey(apiKey, populateUser) {
  if (apiKey === env.INTERNAL_API_KEY) {
    return { valid: true }
  }
  const decrypted = decrypt(apiKey)
  const tenantId = decrypted.split(SEPARATOR)[0]
  return doInTenant(tenantId, async () => {
    const db = getGlobalDB()
    // api key is encrypted in the database
    const userId = await queryGlobalView(
      ViewNames.BY_API_KEY,
      {
        key: apiKey,
      },
      db
    )
    if (userId) {
      return {
        valid: true,
        user: await getUser(userId, tenantId, populateUser),
      }
    } else {
      throw "Invalid API key"
    }
  })
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
    let publicEndpoint = false
    const version = ctx.request.headers[Headers.API_VER]
    // the path is not authenticated
    const found = matches(ctx, noAuthOptions)
    if (found) {
      publicEndpoint = true
    }
    try {
      // check the actual user is authenticated first, try header or cookie
      const headerToken = ctx.request.headers[Headers.TOKEN]
      const authCookie = getCookie(ctx, Cookies.Auth) || openJwt(headerToken)
      let authenticated = false,
        user = null,
        internal = false
      if (authCookie) {
        let error = null
        const sessionId = authCookie.sessionId
        const userId = authCookie.userId

        const session = await getSession(userId, sessionId)
        if (!session) {
          error = "No session found"
        } else {
          try {
            if (opts && opts.populateUser) {
              user = await getUser(
                userId,
                session.tenantId,
                opts.populateUser(ctx)
              )
            } else {
              user = await getUser(userId, session.tenantId)
            }
            user.csrfToken = session.csrfToken
            authenticated = true
          } catch (err) {
            error = err
          }
        }
        if (error) {
          console.error("Auth Error", error)
          // remove the cookie as the user does not exist anymore
          clearCookie(ctx, Cookies.Auth)
        } else {
          // make sure we denote that the session is still in use
          await updateSessionTTL(session)
        }
      }
      const apiKey = ctx.request.headers[Headers.API_KEY]
      const tenantId = ctx.request.headers[Headers.TENANT_ID]
      // this is an internal request, no user made it
      if (!authenticated && apiKey) {
        const populateUser = opts.populateUser ? opts.populateUser(ctx) : null
        const { valid, user: foundUser } = await checkApiKey(
          apiKey,
          populateUser
        )
        if (valid && foundUser) {
          authenticated = true
          user = foundUser
        } else if (valid) {
          authenticated = true
          internal = true
        }
      }
      if (!user && tenantId) {
        user = { tenantId }
      } else if (user) {
        delete user.password
      }
      // be explicit
      if (authenticated !== true) {
        authenticated = false
      }
      // isAuthenticated is a function, so use a variable to be able to check authed state
      finalise(ctx, { authenticated, user, internal, version, publicEndpoint })

      if (user && user.email) {
        return identity.doInUserContext(user, next)
      } else {
        return next()
      }
    } catch (err) {
      // invalid token, clear the cookie
      if (err && err.name === "JsonWebTokenError") {
        clearCookie(ctx, Cookies.Auth)
      }
      // allow configuring for public access
      if ((opts && opts.publicAllowed) || publicEndpoint) {
        finalise(ctx, { authenticated: false, version, publicEndpoint })
        return next()
      } else {
        ctx.throw(err.status || 403, err)
      }
    }
  }
}
