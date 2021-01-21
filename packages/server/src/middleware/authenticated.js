const jwt = require("jsonwebtoken")
const STATUS_CODES = require("../utilities/statusCodes")
const { getRole, BUILTIN_ROLES } = require("../utilities/security/roles")
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

  let token = ctx.cookies.get(getCookieName(appId))
  let authType = AuthTypes.APP
  if (!token && !isClient(ctx)) {
    authType = AuthTypes.BUILDER
    token = ctx.cookies.get(getCookieName())
  }

  if (!token) {
    ctx.auth.authenticated = false
    ctx.appId = appId
    ctx.user = {
      appId,
      role: BUILTIN_ROLES.PUBLIC,
    }
    await next()
    return
  }

  try {
    ctx.auth.authenticated = authType
    const jwtPayload = jwt.verify(token, ctx.config.jwtSecret)
    ctx.appId = appId
    ctx.auth.apiKey = jwtPayload.apiKey
    ctx.user = {
      ...jwtPayload,
      appId: appId,
      role: await getRole(appId, jwtPayload.roleId),
    }
  } catch (err) {
    // TODO - this can happen if the JWT secret is changed and can never login
    // TODO: wipe cookies if they exist
    ctx.throw(err.status || STATUS_CODES.FORBIDDEN, err.text)
  }

  await next()
}
