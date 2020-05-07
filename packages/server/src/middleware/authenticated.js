const jwt = require("jsonwebtoken")
const STATUS_CODES = require("../utilities/statusCodes");

module.exports = async (ctx, next) => {
  if (ctx.isDev) {
    ctx.isAuthenticated = true
    await next();
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
