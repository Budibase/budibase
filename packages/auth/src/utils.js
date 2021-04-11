const { DocumentTypes, SEPARATOR } = require("./db/utils")
const jwt = require("jsonwebtoken")
const { options } = require("./middleware/passport/jwt")

const APP_PREFIX = DocumentTypes.APP + SEPARATOR

function confirmAppId(possibleAppId) {
  return possibleAppId && possibleAppId.startsWith(APP_PREFIX)
    ? possibleAppId
    : undefined
}

/**
 * Given a request tries to find the appId, which can be located in various places
 * @param {object} ctx The main request body to look through.
 * @returns {string|undefined} If an appId was found it will be returned.
 */
exports.getAppId = ctx => {
  const options = [ctx.headers["x-budibase-app-id"], ctx.params.appId]
  if (ctx.subdomains) {
    options.push(ctx.subdomains[1])
  }
  let appId
  for (let option of options) {
    appId = confirmAppId(option)
    if (appId) {
      break
    }
  }

  // look in body if can't find it in subdomain
  if (!appId && ctx.request.body && ctx.request.body.appId) {
    appId = confirmAppId(ctx.request.body.appId)
  }
  let appPath =
    ctx.request.headers.referrer ||
    ctx.path.split("/").filter(subPath => subPath.startsWith(APP_PREFIX))
  if (!appId && appPath.length !== 0) {
    appId = confirmAppId(appPath[0])
  }
  return appId
}

/**
 * Get a cookie from context, and decrypt if necessary.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to get.
 * @param {object} options options .
 */
exports.getCookie = (ctx, value, options = {}) => {
  const cookie = ctx.cookies.get(value)

  if (!cookie) return

  if (!options.decrypt) return cookie

  const payload = jwt.verify(cookie, process.env.JWT_SECRET)
  return payload
}

/**
 * Store a cookie for the request, has a hardcoded expiry.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to set.
 * @param {string|object} value The value of cookie which will be set.
 */
exports.setCookie = (ctx, value, name = "builder") => {
  const expires = new Date()
  expires.setDate(expires.getDate() + 1)

  if (!value) {
    ctx.cookies.set(name)
  } else {
    if (options.encrypt) {
      value = jwt.sign(value, process.env.JWT_SECRET, {
        expiresIn: "1 day",
      })
    }
    ctx.cookies.set(name, value, {
      expires,
      path: "/",
      httpOnly: false,
      overwrite: true,
    })
  }
}

/**
 * Utility function, simply calls setCookie with an empty string for value
 */
exports.clearCookie = (ctx, name) => {
  exports.setCookie(ctx, "", name)
}

/**
 * Checks if the API call being made (based on the provided ctx object) is from the client. If
 * the call is not from a client app then it is from the builder.
 * @param {object} ctx The koa context object to be tested.
 * @return {boolean} returns true if the call is from the client lib (a built app rather than the builder).
 */
exports.isClient = ctx => {
  return ctx.headers["x-budibase-type"] === "client"
}
