const { Cookies } = require("../constants")
const database = require("../db")
const { getCookie, clearCookie } = require("../utils")
const { StaticDatabases } = require("../db/utils")
const env = require("../environment")

const PARAM_REGEX = /\/:(.*?)\//g

function buildNoAuthRegex(patterns) {
  return patterns.map(pattern => {
    const isObj = typeof pattern === "object" && pattern.route
    const method = isObj ? pattern.method : "GET"
    let route = isObj ? pattern.route : pattern

    const matches = route.match(PARAM_REGEX)
    if (matches) {
      for (let match of matches) {
        route = route.replace(match, "/.*/")
      }
    }
    return { regex: new RegExp(route), method }
  })
}

function finalise(ctx, { authenticated, user, internal } = {}) {
  ctx.isAuthenticated = authenticated || false
  ctx.user = user
  ctx.internal = internal || false
}

module.exports = (noAuthPatterns = [], opts) => {
  const noAuthOptions = noAuthPatterns ? buildNoAuthRegex(noAuthPatterns) : []
  return async (ctx, next) => {
    // the path is not authenticated
    const found = noAuthOptions.find(({ regex, method }) => {
      return (
        regex.test(ctx.request.url) &&
        ctx.request.method.toLowerCase() === method.toLowerCase()
      )
    })
    if (found != null) {
      return next()
    }
    try {
      // check the actual user is authenticated first
      const authCookie = getCookie(ctx, Cookies.Auth)
      let authenticated = false,
        user = null,
        internal = false
      if (authCookie) {
        try {
          const db = database.getDB(StaticDatabases.GLOBAL.name)
          const foundUser = await db.get(authCookie.userId)
          delete foundUser.password
          authenticated = true
          user = foundUser
        } catch (err) {
          // remove the cookie as the use does not exist anymore
          clearCookie(ctx, Cookies.Auth)
        }
      }
      const apiKey = ctx.request.headers["x-budibase-api-key"]
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
      finalise(ctx, { authenticated, user, internal })
      return next()
    } catch (err) {
      // allow configuring for public access
      if (opts && opts.publicAllowed) {
        finalise(ctx, { authenticated: false })
      } else {
        ctx.throw(err.status || 403, err)
      }
    }
  }
}
