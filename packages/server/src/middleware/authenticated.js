const jwt = require("jsonwebtoken")
const STATUS_CODES = require("../utilities/statusCodes")
const accessLevelController = require("../api/controllers/accesslevel")
const {
  ADMIN_LEVEL_ID,
  POWERUSER_LEVEL_ID,
  BUILDER_LEVEL_ID,
  ANON_LEVEL_ID,
} = require("../utilities/accessLevels")
const environment = require("../environment")
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
  if (!environment.CLOUD && !appToken) {
    token = builderToken
    ctx.auth.authenticated = AuthTypes.BUILDER
  } else {
    token = appToken
    ctx.auth.authenticated = AuthTypes.APP
  }

  if (!token) {
    ctx.auth.authenticated = false

    let appId = process.env.CLOUD ? ctx.subdomains[1] : ctx.params.appId

    if (!appId) {
      appId = ctx.referer && ctx.referer.split("/").pop()
    }

    ctx.user = {
      // if appId can't be determined from path param or subdomain
      appId: appId,
    }
    await next()
    return
  }

  try {
    const jwtPayload = jwt.verify(token, ctx.config.jwtSecret)
    ctx.auth.apiKey = jwtPayload.apiKey
    ctx.user = {
      ...jwtPayload,
      accessLevel: await getAccessLevel(
        jwtPayload.instanceId,
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
 * @param {*} instanceId - instanceId of the user
 * @param {*} accessLevelId - the id of the users access level
 */
const getAccessLevel = async (instanceId, accessLevelId) => {
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
      instanceId,
    },
  }
  await accessLevelController.find(findAccessContext)
  return findAccessContext.body
}
