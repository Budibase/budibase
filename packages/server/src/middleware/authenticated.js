const jwt = require("jsonwebtoken")
const STATUS_CODES = require("../utilities/statusCodes")
const accessLevelController = require("../api/controllers/accesslevel")
const {
  ADMIN_LEVEL_ID,
  POWERUSER_LEVEL_ID,
  BUILDER_LEVEL_ID,
  ANON_LEVEL_ID,
} = require("../utilities/accessLevels")
const env = require("../environment")
const { AuthTypes } = require("../constants")

module.exports = async (ctx, next) => {
  if (ctx.path === "/_builder") {
    await next()
    return
  }

  const appToken = ctx.cookies.get("budibase:token")
  const builderToken = ctx.cookies.get("builder:token")

  let token
  // if running locally in the builder itself
  if (!env.CLOUD && !appToken) {
    token = builderToken
    ctx.auth.authenticated = AuthTypes.BUILDER
  } else {
    token = appToken
    ctx.auth.authenticated = AuthTypes.APP
  }

  if (!token) {
    ctx.auth.authenticated = false

    let appId = env.CLOUD ? ctx.subdomains[1] : ctx.params.appId

    // if appId can't be determined from path param or subdomain
    if (!appId && ctx.request.headers.referer) {
      const url = new URL(ctx.request.headers.referer)
      // remove leading and trailing slashes from appId
      appId = url.pathname.replace(/\//g, "")
    }

    ctx.user = {
      appId,
    }
    await next()
    return
  }

  try {
    const jwtPayload = jwt.verify(token, ctx.config.jwtSecret)
    ctx.auth.apiKey = jwtPayload.apiKey
    ctx.user = {
      ...jwtPayload,
      appId: jwtPayload.appId,
      accessLevel: await getAccessLevel(
        jwtPayload.appId,
        jwtPayload.accessLevelId
      ),
    }
  } catch (err) {
    ctx.throw(err.status || STATUS_CODES.FORBIDDEN, err.text)
  }

  await next()
}

/**
 * Return the full access level object either from constants
 * or the database based on the access level ID passed.
 *
 * @param {*} appId - appId of the user
 * @param {*} accessLevelId - the id of the users access level
 */
const getAccessLevel = async (appId, accessLevelId) => {
  if (
    accessLevelId === POWERUSER_LEVEL_ID ||
    accessLevelId === ADMIN_LEVEL_ID ||
    accessLevelId === BUILDER_LEVEL_ID ||
    accessLevelId === ANON_LEVEL_ID
  ) {
    return {
      _id: accessLevelId,
      name: accessLevelId,
      permissions: [],
    }
  }

  const findAccessContext = {
    params: {
      levelId: accessLevelId,
    },
    user: {
      appId,
    },
  }
  await accessLevelController.find(findAccessContext)
  return findAccessContext.body
}
