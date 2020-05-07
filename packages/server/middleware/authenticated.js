const jwt = require("jsonwebtoken")

module.exports = async (ctx, next) => {
  const token = ctx.cookies.get("budibase:token")
  console.log("TOKEN", token)

  if (!token) {
    ctx.isAuthenticated = false
    await next()
    return
  }

  try {
    ctx.jwtPayload = jwt.verify(token, ctx.config.jwtSecret)
    ctx.isAuthenticated = true
  } catch (err) {
    ctx.throw(err.status || 403, err.text)
  }

  await next()
}
