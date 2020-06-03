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

  const appToken = ctx.cookies.get("budibase:token")
  const builderToken = ctx.cookies.get("builder:token")
  const isBuilderAgent = ctx.headers["x-user-agent"] === "Budibase Builder"

  // all admin api access should auth with buildertoken and 'Budibase Builder user agent
  const shouldAuthAsBuilder = isBuilderAgent && builderToken

  if (shouldAuthAsBuilder) {
    const builderTokenValid = builderToken === env.ADMIN_SECRET

    ctx.isAuthenticated = builderTokenValid
    ctx.isBuilder = builderTokenValid

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
      accessLevel: await getAccessLevel(
        jwtPayload.instanceId,
        jwtPayload.accessLevelId
      ),
    }
    ctx.isAuthenticated = true
  } catch (err) {
    ctx.throw(err.status || STATUS_CODES.FORBIDDEN, err.text)
  }

  await next()
}

const getAccessLevel = async (instanceId, accessLevelId) => {
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
    params: {
      levelId: accessLevelId,
      instanceId,
    },
  }
  await accessLevelController.find(findAccessContext)
  return findAccessContext.body
}
