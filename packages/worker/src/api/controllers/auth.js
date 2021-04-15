const { passport, Cookies, clearCookie } = require("@budibase/auth")

exports.authenticate = async (ctx, next) => {
  return passport.authenticate("local", async (err, user) => {
    if (err) {
      return ctx.throw(403, "Unauthorized")
    }

    const expires = new Date()
    expires.setDate(expires.getDate() + 1)

    if (!user) {
      return ctx.throw(403, "Unauthorized")
    }

    ctx.cookies.set(Cookies.Auth, user.token, {
      expires,
      path: "/",
      httpOnly: false,
      overwrite: true,
    })

    delete user.token

    ctx.body = { user }
  })(ctx, next)
}

exports.logout = async ctx => {
  clearCookie(ctx, Cookies.Auth)
  ctx.body = { messaged: "User logged out" }
}

exports.googleAuth = async () => {
  // return passport.authenticate("google")
}

exports.googleAuth = async () => {
  // return passport.authenticate("google")
}
