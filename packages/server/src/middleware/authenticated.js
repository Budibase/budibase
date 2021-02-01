const jwt = require("jsonwebtoken")
const STATUS_CODES = require("../utilities/statusCodes")
const { getRole, BUILTIN_ROLES } = require("../utilities/security/roles")
const { AuthTypes } = require("../constants")
const {
  getAppId,
  getCookieName,
  clearCookie,
  setCookie,
  isClient,
} = require("../utilities")

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
    setCookie(ctx, appId, "currentapp")
  } else if (cookieAppId) {
    appId = cookieAppId
  }
  let token, authType
  if (!isClient(ctx)) {
    token = ctx.cookies.get(getCookieName())
    authType = AuthTypes.BUILDER
  }
  if (!token && appId) {
    token = ctx.cookies.get(getCookieName(appId))
    authType = AuthTypes.APP
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
    if (authType === AuthTypes.BUILDER) {
      clearCookie(ctx)
      ctx.status = 200
      return
    } else {
      ctx.throw(err.status || STATUS_CODES.FORBIDDEN, err.text)
    }
  }

  await next()
}
