const { Cookies } = require("../constants")
const { getCookie } = require("../utils")
const { getEmailFromUserID } = require("../db/utils")

module.exports = async (ctx, next) => {
  try {
    // check the actual user is authenticated first
    const authCookie = getCookie(ctx, Cookies.Auth)

    if (authCookie) {
      ctx.isAuthenticated = true
      ctx.user = authCookie
      // make sure email is correct from ID
      ctx.user.email = getEmailFromUserID(authCookie._id)
    }

    await next()
  } catch (err) {
    ctx.throw(err.status || 403, err.text)
  }
}
