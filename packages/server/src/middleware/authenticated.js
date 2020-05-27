const jwt = require("jsonwebtoken")
const STATUS_CODES = require("../utilities/statusCodes")
const env = require("../environment")
const accessLevelController = require("../api/controllers/accesslevel")
const {
  ADMIN_LEVEL_ID,
  POWERUSER_LEVEL_ID,
} = require("../utilities/accessLevels")

module.exports = async (ctx, next) => {
  if (ctx.path === "/_builder") {
    await next()
    return
  }

  if (ctx.cookies.get("builder:token") === env.ADMIN_SECRET) {
    ctx.isAuthenticated = true
    ctx.isBuilder = true
    await next()
    return
  }

  const token = ctx.cookies.get("budibase:token")

  if (!token) {
    ctx.isAuthenticated = false
    await next()
    return
  }

  try {
    const jwtPayload = jwt.verify(token, ctx.config.jwtSecret)

    ctx.user = {
      ...jwtPayload,
      accessLevel: await getAccessLevel(jwtPayload.accessLevelId),
    }
    ctx.isAuthenticated = true
  } catch (err) {
    ctx.throw(err.status || STATUS_CODES.FORBIDDEN, err.text)
  }

  await next()
}

const getAccessLevel = async accessLevelId => {
  if (
    accessLevelId === POWERUSER_LEVEL_ID ||
    accessLevelId === ADMIN_LEVEL_ID
  ) {
    return {
      _id: accessLevelId,
      name: accessLevelId,
      permissions: [],
    }
  }

  const findAccessContext = {
    params: { levelId: accessLevelId },
  }
  await accessLevelController.find(findAccessContext)
  return findAccessContext.body
}
