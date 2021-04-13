const { passport, Cookies, clearCookie } = require("@budibase/auth")

exports.authenticate = async (ctx, next) => {
  return passport.authenticate("local", async (err, user) => {
    if (err) {
      return ctx.throw(err)
    }

    const expires = new Date()
    expires.setDate(expires.getDate() + 1)

    if (!user) {
      ctx.body = { success: false }
      return next()
    }

    ctx.cookies.set(Cookies.Auth, user.token, {
      expires,
      path: "/",
      httpOnly: false,
      overwrite: true,
    })

    delete user.token

    ctx.body = { success: true, user }
  })(ctx, next)
}

exports.logout = async ctx => {
  clearCookie(ctx, Cookies.Auth)
  ctx.body = { success: true }
}

exports.googleAuth = async (ctx, next) => {
  // return passport.authenticate("google")
}

exports.googleAuth = async (ctx, next) => {
  // return passport.authenticate("google")
}
