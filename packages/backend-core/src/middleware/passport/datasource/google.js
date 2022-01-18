const { getScopedConfig } = require("../../../db/utils")
const { getGlobalDB } = require("../../../tenancy")
const google = require("../google")
const { Configs, Cookies } = require("../../../constants")
const { clearCookie, getCookie } = require("../../../utils")
const { getDB } = require("../../../db")

async function preAuth(passport, ctx, next) {
  const db = getGlobalDB()
  // get the relevant config
  const config = await getScopedConfig(db, {
    type: Configs.GOOGLE,
    workspace: ctx.query.workspace,
  })
  const publicConfig = await getScopedConfig(db, {
    type: Configs.SETTINGS,
  })
  let callbackUrl = `${publicConfig.platformUrl}/api/global/auth/datasource/google/callback`
  const strategy = await google.strategyFactory(config, callbackUrl)

  if (!ctx.query.appId || !ctx.query.datasourceId) {
    ctx.throw(400, "appId and datasourceId query params not present.")
  }

  return passport.authenticate(strategy, {
    scope: ["profile", "email", "https://www.googleapis.com/auth/spreadsheets"],
  })(ctx, next)
}

async function postAuth(passport, ctx, next) {
  const db = getGlobalDB()

  const config = await getScopedConfig(db, {
    type: Configs.GOOGLE,
    workspace: ctx.query.workspace,
  })

  const publicConfig = await getScopedConfig(db, {
    type: Configs.SETTINGS,
  })

  let callbackUrl = `${publicConfig.platformUrl}/api/global/auth/datasource/google/callback`
  const strategy = await google.strategyFactory(
    config,
    callbackUrl,
    (accessToken, refreshToken, profile, done) => {
      clearCookie(ctx, Cookies.DatasourceAuth)
      done(null, { accessToken, refreshToken })
    }
  )

  const authStateCookie = getCookie(ctx, Cookies.DatasourceAuth)

  return passport.authenticate(
    strategy,
    { successRedirect: "/", failureRedirect: "/error" },
    async (err, tokens) => {
      // update the DB for the datasource with all the user info
      const db = getDB(authStateCookie.appId)
      const datasource = await db.get(authStateCookie.datasourceId)
      datasource.config = {
        auth: {
          type: "google",
          ...tokens,
        },
      }
      await db.put(datasource)
      ctx.redirect(
        `/builder/app/${authStateCookie.appId}/data/datasource/${authStateCookie.datasourceId}`
      )
    }
  )(ctx, next)
}

exports.preAuth = preAuth
exports.postAuth = postAuth
