const authPkg = require("@budibase/auth")
const { google } = require("@budibase/auth/src/middleware")
const { oidc } = require("@budibase/auth/src/middleware")
const { Configs, EmailTemplatePurpose } = require("../../../constants")
const CouchDB = require("../../../db")
const { sendEmail, isEmailConfigured } = require("../../../utilities/email")
const { clearCookie, getGlobalUserByEmail, hash } = authPkg.utils
const { Cookies } = authPkg.constants
const { passport } = authPkg.auth
const { checkResetPasswordCode } = require("../../../utilities/redis")

const GLOBAL_DB = authPkg.StaticDatabases.GLOBAL.name

function authInternal(ctx, user, err = null, info = null) {
  if (err) {
    console.error("Authentication error", err)
    return ctx.throw(403, info ? info : "Unauthorized")
  }

  const expires = new Date()
  expires.setDate(expires.getDate() + 1)

  if (!user) {
    return ctx.throw(403, info ? info : "Unauthorized")
  }

  ctx.cookies.set(Cookies.Auth, user.token, {
    expires,
    path: "/",
    httpOnly: false,
    overwrite: true,
  })
}

exports.authenticate = async (ctx, next) => {
  return passport.authenticate("local", async (err, user, info) => {
    authInternal(ctx, user, err, info)

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
    ctx.throw(
      400,
      "Please contact your platform administrator, SMTP is not configured."
    )
  }
  try {
    const user = await getGlobalUserByEmail(email)
    // only if user exists, don't error though if they don't
    if (user) {
      await sendEmail(email, EmailTemplatePurpose.PASSWORD_RECOVERY, {
        user,
        subject: "{{ company }} platform password reset",
      })
    }
  } catch (err) {
    // don't throw any kind of error to the user, this might give away something
  }
  ctx.body = {
    message: "Please check your email for a reset link.",
  }
}

/**
 * Perform the user password update if the provided reset code is valid.
 */
exports.resetUpdate = async ctx => {
  const { resetCode, password } = ctx.request.body
  try {
    const userId = await checkResetPasswordCode(resetCode)
    const db = new CouchDB(GLOBAL_DB)
    const user = await db.get(userId)
    user.password = await hash(password)
    await db.put(user)
    ctx.body = {
      message: "password reset successfully.",
    }
  } catch (err) {
    ctx.throw(400, "Cannot reset password.")
  }
}

exports.logout = async ctx => {
  clearCookie(ctx, Cookies.Auth)
  ctx.body = { message: "User logged out." }
}

/**
 * The initial call that google authentication makes to take you to the google login screen.
 * On a successful login, you will be redirected to the googleAuth callback route.
 */
exports.googlePreAuth = async (ctx, next) => {
  const db = new CouchDB(GLOBAL_DB)
  const config = await authPkg.db.getScopedConfig(db, {
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

  const config = await authPkg.db.getScopedConfig(db, {
    type: Configs.GOOGLE,
    group: ctx.query.group,
  })
  const strategy = await google.strategyFactory(config)

  return passport.authenticate(
    strategy,
    { successRedirect: "/", failureRedirect: "/error" },
    async (err, user, info) => {
      authInternal(ctx, user, err, info)

      ctx.redirect("/")
    }
  )(ctx, next)
}

async function oidcStrategyFactory(ctx) {
  const db = new CouchDB(GLOBAL_DB)

  const config = await authPkg.db.getScopedConfig(db, {
    type: Configs.OIDC,
    group: ctx.query.group,
  })

  const callbackUrl = `${ctx.protocol}://${ctx.host}/api/admin/auth/oidc/callback`

  return oidc.strategyFactory(config, callbackUrl)
}

/**
 * The initial call that OIDC authentication makes to take you to the configured OIDC login screen.
 * On a successful login, you will be redirected to the oidcAuth callback route.
 */
exports.oidcPreAuth = async (ctx, next) => {
  const strategy = await oidcStrategyFactory(ctx)

  return passport.authenticate(strategy, {
    // required 'openid' scope is added by oidc strategy factory
    scope: ["profile", "email"],
  })(ctx, next)
}

exports.oidcAuth = async (ctx, next) => {
  const strategy = await oidcStrategyFactory(ctx)

  return passport.authenticate(
    strategy,
    { successRedirect: "/", failureRedirect: "/error" },
    async (err, user, info) => {
      authInternal(ctx, user, err, info)

      ctx.redirect("/")
    }
  )(ctx, next)
}
