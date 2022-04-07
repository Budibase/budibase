const {
  DocumentTypes,
  SEPARATOR,
  ViewNames,
  generateGlobalUserID,
  getAllApps,
} = require("./db/utils")
const jwt = require("jsonwebtoken")
const { options } = require("./middleware/passport/jwt")
const { queryGlobalView } = require("./db/views")
const { Headers, UserStatus, Cookies, MAX_VALID_DATE } = require("./constants")
const {
  getGlobalDB,
  updateTenantId,
  getTenantUser,
  tryAddTenant,
} = require("./tenancy")
const environment = require("./environment")
const accounts = require("./cloud/accounts")
const { hash } = require("./hashing")
const userCache = require("./cache/user")
const env = require("./environment")
const { getUserSessions, invalidateSessions } = require("./security/sessions")
const tenancy = require("./tenancy")

const APP_PREFIX = DocumentTypes.APP + SEPARATOR
const PROD_APP_PREFIX = "/app/"

function confirmAppId(possibleAppId) {
  return possibleAppId && possibleAppId.startsWith(APP_PREFIX)
    ? possibleAppId
    : undefined
}

async function resolveAppUrl(ctx) {
  const appUrl = ctx.path.split("/")[2]
  let possibleAppUrl = `/${appUrl.toLowerCase()}`

  let tenantId = tenancy.getTenantId()
  if (!env.SELF_HOSTED && ctx.subdomains.length) {
    // always use the tenant id from the url in cloud
    tenantId = ctx.subdomains[0]
  }

  // search prod apps for a url that matches
  const apps = await tenancy.doInTenant(tenantId, () =>
    getAllApps({ dev: false })
  )
  const app = apps.filter(
    a => a.url && a.url.toLowerCase() === possibleAppUrl
  )[0]

  return app && app.appId ? app.appId : undefined
}

/**
 * Given a request tries to find the appId, which can be located in various places
 * @param {object} ctx The main request body to look through.
 * @returns {string|undefined} If an appId was found it will be returned.
 */
exports.getAppIdFromCtx = async ctx => {
  // look in headers
  const options = [ctx.headers[Headers.APP_ID]]
  let appId
  for (let option of options) {
    appId = confirmAppId(option)
    if (appId) {
      break
    }
  }

  // look in body
  if (!appId && ctx.request.body && ctx.request.body.appId) {
    appId = confirmAppId(ctx.request.body.appId)
  }

  // look in the url - dev app
  let appPath =
    ctx.request.headers.referrer ||
    ctx.path.split("/").filter(subPath => subPath.startsWith(APP_PREFIX))
  if (!appId && appPath.length) {
    appId = confirmAppId(appPath[0])
  }

  // look in the url - prod app
  if (!appId && ctx.path.startsWith(PROD_APP_PREFIX)) {
    appId = confirmAppId(await resolveAppUrl(ctx))
  }

  return appId
}

/**
 * opens the contents of the specified encrypted JWT.
 * @return {object} the contents of the token.
 */
exports.openJwt = token => {
  if (!token) {
    return token
  }
  return jwt.verify(token, options.secretOrKey)
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

  return exports.openJwt(cookie)
}

/**
 * Store a cookie for the request - it will not expire.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to set.
 * @param {string|object} value The value of cookie which will be set.
 * @param {object} opts options like whether to sign.
 */
exports.setCookie = (ctx, value, name = "builder", opts = { sign: true }) => {
  if (value && opts && opts.sign) {
    value = jwt.sign(value, options.secretOrKey)
  }

  const config = {
    expires: MAX_VALID_DATE,
    path: "/",
    httpOnly: false,
    overwrite: true,
  }

  if (environment.COOKIE_DOMAIN) {
    config.domain = environment.COOKIE_DOMAIN
  }

  ctx.cookies.set(name, value, config)
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
  return ctx.headers[Headers.TYPE] === "client"
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

  return queryGlobalView(ViewNames.USER_BY_EMAIL, {
    key: email.toLowerCase(),
    include_docs: true,
  })
}

exports.saveUser = async (
  user,
  tenantId,
  hashPassword = true,
  requirePassword = true
) => {
  if (!tenantId) {
    throw "No tenancy specified."
  }
  // need to set the context for this request, as specified
  updateTenantId(tenantId)
  // specify the tenancy incase we're making a new admin user (public)
  const db = getGlobalDB(tenantId)
  let { email, password, _id } = user
  // make sure another user isn't using the same email
  let dbUser
  if (email) {
    // check budibase users inside the tenant
    dbUser = await exports.getGlobalUserByEmail(email)
    if (dbUser != null && (dbUser._id !== _id || Array.isArray(dbUser))) {
      throw `Email address ${email} already in use.`
    }

    // check budibase users in other tenants
    if (env.MULTI_TENANCY) {
      const tenantUser = await getTenantUser(email)
      if (tenantUser != null && tenantUser.tenantId !== tenantId) {
        throw `Email address ${email} already in use.`
      }
    }

    // check root account users in account portal
    if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
      const account = await accounts.getAccount(email)
      if (account && account.verified && account.tenantId !== tenantId) {
        throw `Email address ${email} already in use.`
      }
    }
  } else {
    dbUser = await db.get(_id)
  }

  // get the password, make sure one is defined
  let hashedPassword
  if (password) {
    hashedPassword = hashPassword ? await hash(password) : password
  } else if (dbUser) {
    hashedPassword = dbUser.password
  } else if (requirePassword) {
    throw "Password must be specified."
  }

  _id = _id || generateGlobalUserID()
  user = {
    createdAt: Date.now(),
    ...dbUser,
    ...user,
    _id,
    password: hashedPassword,
    tenantId,
  }
  // make sure the roles object is always present
  if (!user.roles) {
    user.roles = {}
  }
  // add the active status to a user if its not provided
  if (user.status == null) {
    user.status = UserStatus.ACTIVE
  }
  try {
    const response = await db.put({
      password: hashedPassword,
      ...user,
    })
    await tryAddTenant(tenantId, _id, email)
    await userCache.invalidateUser(response.id)
    return {
      _id: response.id,
      _rev: response.rev,
      email,
    }
  } catch (err) {
    if (err.status === 409) {
      throw "User exists already"
    } else {
      throw err
    }
  }
}

/**
 * Logs a user out from budibase. Re-used across account portal and builder.
 */
exports.platformLogout = async ({ ctx, userId, keepActiveSession }) => {
  if (!ctx) throw new Error("Koa context must be supplied to logout.")

  const currentSession = exports.getCookie(ctx, Cookies.Auth)
  let sessions = await getUserSessions(userId)

  if (keepActiveSession) {
    sessions = sessions.filter(
      session => session.sessionId !== currentSession.sessionId
    )
  } else {
    // clear cookies
    exports.clearCookie(ctx, Cookies.Auth)
    exports.clearCookie(ctx, Cookies.CurrentApp)
  }

  await invalidateSessions(
    userId,
    sessions.map(({ sessionId }) => sessionId)
  )
}
