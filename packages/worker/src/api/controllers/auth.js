const {
  passport,
  Cookies,
  StaticDatabases,
  clearCookie,
} = require("@budibase/auth")
const CouchDB = require("../../db")

const GLOBAL_DB = StaticDatabases.GLOBAL.name

async function setToken(ctx) {
  return async function(err, user) {
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
  }
}

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
  ctx.body = { message: "User logged out" }
}

// exports.googleAuth = async (ctx, next) =>
//   passport.authenticate(
//     "google",
//     { successRedirect: "/", failureRedirect: "/" },
//     (ctx
//     setToken(ctx, next)
//   )

exports.googleAuth = async (ctx, next) => {
  return passport.authenticate(
    "google",
    { successRedirect: "/", failureRedirect: "/" },
    async (err, user) => {
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

      ctx.redirect("/")
    }
  )(ctx, next)
}
