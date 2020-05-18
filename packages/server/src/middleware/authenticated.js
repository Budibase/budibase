const jwt = require("jsonwebtoken")
const STATUS_CODES = require("../utilities/statusCodes")
const env = require("../environment")

module.exports = async (ctx, next) => {
  const authHeader = ctx.get("Authorization")

  if (
    authHeader &&
    authHeader.startsWith("Basic") &&
    authHeader.split(" ")[1] === env.ADMIN_SECRET
  ) {
    ctx.isAuthenticated = true
    await next()
    return
  }

  if (ctx.isDev && ctx.cookies.get("builder:token") === env.ADMIN_SECRET) {
    ctx.isAuthenticated = true
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
    ctx.jwtPayload = jwt.verify(token, ctx.config.jwtSecret)
    ctx.isAuthenticated = true
  } catch (err) {
    ctx.throw(err.status || STATUS_CODES.FORBIDDEN, err.text)
  }

  await next()
}
