const jwt = require("jsonwebtoken")
const STATUS_CODES = require("../utilities/statusCodes")
const accessLevelController = require("../api/controllers/accesslevel")
const { ADMIN_LEVEL_ID, POWERUSER_LEVEL_ID, BUILDER_LEVEL_ID, ANON_LEVEL_ID } = require("../utilities/accessLevels")

module.exports = async (ctx, next) => {
  if (ctx.path === "/_builder") {
    await next()
    return
  }

  const appToken = ctx.cookies.get("budibase:token")
  const builderToken = ctx.cookies.get("builder:token")

  if (builderToken) {
    try {
      const jwtPayload = jwt.verify(builderToken, ctx.config.jwtSecret)
      ctx.isAuthenticated = jwtPayload.accessLevelId === BUILDER_LEVEL_ID
      ctx.user = {
        ...jwtPayload,
        accessLevel: await getAccessLevel(jwtPayload.instanceId, jwtPayload.accessLevelId),
      }
    } catch (_) {
      // empty: do nothing
    }

    await next()
    return
  }

  if (!appToken) {
    ctx.isAuthenticated = false
    await next()
    return
  }

  try {
    const jwtPayload = jwt.verify(appToken, ctx.config.jwtSecret)

    ctx.user = {
      ...jwtPayload,
      accessLevel: await getAccessLevel(jwtPayload.instanceId, jwtPayload.accessLevelId),
    }
    ctx.isAuthenticated = ctx.user.accessLevelId !== ANON_LEVEL_ID
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
