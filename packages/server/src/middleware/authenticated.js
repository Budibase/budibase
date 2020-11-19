const jwt = require("jsonwebtoken")
const STATUS_CODES = require("../utilities/statusCodes")
const {
  getAccessLevel,
  BUILTIN_LEVELS,
} = require("../utilities/security/accessLevels")
const { AuthTypes } = require("../constants")
const { getAppId, getCookieName, setCookie, isClient } = require("../utilities")

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

  let token
  if (isClient(ctx)) {
    ctx.auth.authenticated = AuthTypes.APP
    token = ctx.cookies.get(getCookieName(appId))
  } else {
    ctx.auth.authenticated = AuthTypes.BUILDER
    token = ctx.cookies.get(getCookieName())
  }

  if (!token) {
    ctx.auth.authenticated = false
    ctx.appId = appId
    ctx.user = {
      appId,
      accessLevel: BUILTIN_LEVELS.PUBLIC,
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
