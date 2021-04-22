const { Cookies } = require("../constants")
const database = require("../db")
const { getCookie } = require("../utils")
const { StaticDatabases } = require("../db/utils")

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
        const db = database.getDB(StaticDatabases.GLOBAL.name)
        const user = await db.get(authCookie.userId)
        delete user.password
        ctx.isAuthenticated = true
        ctx.user = user
      }

      return next()
    } catch (err) {
      ctx.throw(err.status || 403, err)
    }
  }
}
