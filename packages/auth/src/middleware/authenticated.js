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
      const apiKey = ctx.request.headers["x-budibase-api-key"]
      // check the actual user is authenticated first
      const authCookie = getCookie(ctx, Cookies.Auth)

      // this is an internal request, no user made it
      if (apiKey && apiKey === env.INTERNAL_API_KEY) {
        ctx.isAuthenticated = true
        ctx.internal = true
      } else if (authCookie) {
        try {
          const db = database.getDB(StaticDatabases.GLOBAL.name)
          const user = await db.get(authCookie.userId)
          delete user.password
          ctx.isAuthenticated = true
          ctx.user = user
        } catch (err) {
          // remove the cookie as the use does not exist anymore
          clearCookie(ctx, Cookies.Auth)
        }
      }
      // be explicit
      if (ctx.isAuthenticated !== true) {
        ctx.isAuthenticated = false
      }
      return next()
    } catch (err) {
      // allow configuring for public access
      if (opts && opts.publicAllowed) {
        ctx.isAuthenticated = false
      } else {
        ctx.throw(err.status || 403, err)
      }
    }
  }
}
