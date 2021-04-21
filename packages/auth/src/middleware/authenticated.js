const { Cookies } = require("../constants")
const { getCookie } = require("../utils")

module.exports = (noAuthPatterns = []) => {
  const regex = new RegExp(noAuthPatterns.join("|"))
  return async (ctx, next) => {
    // the path is not authenticated
    if (regex.test(ctx.request.url)) {
      return next()
    }
    try {
      // check the actual user is authenticated first
      const authCookie = getCookie(ctx, Cookies.Auth)

      if (authCookie) {
        ctx.isAuthenticated = true
        ctx.user = authCookie
      }

      return next()
    } catch (err) {
      ctx.throw(err.status || 403, err)
    }
  }
}
