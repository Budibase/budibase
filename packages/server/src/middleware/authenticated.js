const jwt = require("jsonwebtoken")
const STATUS_CODES = require("../utilities/statusCodes")
const { getAccessLevel } = require("../utilities/security/accessLevels")
const env = require("../environment")
const { AuthTypes } = require("../constants")
const { getAppId, getCookieName, setCookie } = require("../utilities")

module.exports = async (ctx, next) => {
  if (ctx.path === "/_builder") {
    await next()
    return
  }

  // do everything we can to make sure the appId is held correctly
  // we hold it in state as a
  let appId = getAppId(ctx)
  const cookieAppId = ctx.cookies.get(getCookieName("currentapp"))
  if (appId && cookieAppId !== appId) {
    setCookie(ctx, "currentapp", appId)
  } else if (cookieAppId) {
    appId = cookieAppId
  }

  const appToken = ctx.cookies.get(getCookieName(appId))
  const builderToken = ctx.cookies.get(getCookieName())

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
    ctx.appId = appId
    ctx.user = {
      appId,
    }
    await next()
    return
  }

  try {
    const jwtPayload = jwt.verify(token, ctx.config.jwtSecret)
    ctx.appId = appId
    ctx.auth.apiKey = jwtPayload.apiKey
    ctx.user = {
      ...jwtPayload,
      appId: appId,
      accessLevel: await getAccessLevel(appId, jwtPayload.accessLevelId),
    }
  } catch (err) {
    ctx.throw(err.status || STATUS_CODES.FORBIDDEN, err.text)
  }

  await next()
}
