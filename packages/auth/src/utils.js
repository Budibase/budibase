const {
  DocumentTypes,
  SEPARATOR,
  ViewNames,
  StaticDatabases,
} = require("./db/utils")
const jwt = require("jsonwebtoken")
const { options } = require("./middleware/passport/jwt")
const { createUserEmailView } = require("./db/views")
const { getDB } = require("./db")

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
 */
exports.getCookie = (ctx, name) => {
  const cookie = ctx.cookies.get(name)

  if (!cookie) {
    return cookie
  }

  return jwt.verify(cookie, options.secretOrKey)
}

/**
 * Store a cookie for the request - it will not expire.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to set.
 * @param {string|object} value The value of cookie which will be set.
 */
exports.setCookie = (ctx, value, name = "builder") => {
  if (!value) {
    ctx.cookies.set(name)
  } else {
    value = jwt.sign(value, options.secretOrKey)
    ctx.cookies.set(name, value, {
      maxAge: Number.MAX_SAFE_INTEGER,
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
  exports.setCookie(ctx, null, name)
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

/**
 * Given an email address this will use a view to search through
 * all the users to find one with this email address.
 * @param {string} email the email to lookup the user by.
 * @return {Promise<object|null>}
 */
exports.getGlobalUserByEmail = async email => {
  if (email == null) {
    throw "Must supply an email address to view"
  }
  const db = getDB(StaticDatabases.GLOBAL.name)
  try {
    let users = (
      await db.query(`database/${ViewNames.USER_BY_EMAIL}`, {
        key: email,
        include_docs: true,
      })
    ).rows
    users = users.map(user => user.doc)
    return users.length <= 1 ? users[0] : users
  } catch (err) {
    if (err != null && err.name === "not_found") {
      await createUserEmailView()
      return exports.getGlobalUserByEmail(email)
    } else {
      throw err
    }
  }
}
