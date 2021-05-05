const authPkg = require("@budibase/auth")
const { google } = require("@budibase/auth/src/middleware")
const { Configs } = require("../../../constants")
const CouchDB = require("../../../db")
const { sendEmail, isEmailConfigured } = require("../../../utilities/email")
const { clearCookie, getGlobalUserByEmail } = authPkg.utils
const { Cookies } = authPkg.constants
const { passport } = authPkg.auth

const GLOBAL_DB = authPkg.StaticDatabases.GLOBAL.name

function authInternal(ctx, user, err = null) {
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
}

exports.authenticate = async (ctx, next) => {
  return passport.authenticate("local", async (err, user) => {
    authInternal(ctx, user, err)

    delete user.token

    ctx.body = { user }
  })(ctx, next)
}

/**
 * Reset the user password, used as part of a forgotten password flow.
 */
exports.reset = async ctx => {
  const { email } = ctx.request.body
  const configured = await isEmailConfigured()
  if (!configured) {
    throw "Please contact your platform administrator, SMTP is not configured."
  }
  try {
    const user = await getGlobalUserByEmail(email)
    sendEmail()
  } catch (err) {
    // don't throw any kind of error to the user, this might give away something
  }
  ctx.body = {
    message: "If user exists an email has been sent."
  }
}

exports.logout = async ctx => {
  clearCookie(ctx, Cookies.Auth)
  ctx.body = { message: "User logged out" }
}

/**
 * The initial call that google authentication makes to take you to the google login screen.
 * On a successful login, you will be redirected to the googleAuth callback route.
 */
exports.googlePreAuth = async (ctx, next) => {
  const db = new CouchDB(GLOBAL_DB)
  const config = await authPkg.db.determineScopedConfig(db, {
    type: Configs.GOOGLE,
    group: ctx.query.group,
  })
  const strategy = await google.strategyFactory(config)

  return passport.authenticate(strategy, {
    scope: ["profile", "email"],
  })(ctx, next)
}

exports.googleAuth = async (ctx, next) => {
  const db = new CouchDB(GLOBAL_DB)

  const config = await authPkg.db.determineScopedConfig(db, {
    type: Configs.GOOGLE,
    group: ctx.query.group,
  })
  const strategy = await google.strategyFactory(config)

  return passport.authenticate(
    strategy,
    { successRedirect: "/", failureRedirect: "/error" },
    async (err, user) => {
      authInternal(ctx, user, err)

      ctx.redirect("/")
    }
  )(ctx, next)
}
