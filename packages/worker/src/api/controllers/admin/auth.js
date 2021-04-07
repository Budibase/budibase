const passport = require("@budibase/auth")

exports.authenticate = async (ctx, next) => {
  return passport.authenticate("local", async (err, user) => {
    if (err) {
      return ctx.throw(err)
    }

    const expires = new Date()
    expires.setDate(expires.getDate() + 1)

    ctx.cookies.set("budibase:auth", user.token, {
      expires,
      path: "/",
      httpOnly: false,
      overwrite: true,
    })

    ctx.body = { success: true }
  })(ctx, next)
}
