const google = require("../google")
const { Cookies, Configs } = require("../../../constants")
const { clearCookie, getCookie } = require("../../../utils")
const { getScopedConfig } = require("../../../db/utils")
const { doWithDB } = require("../../../db")
const environment = require("../../../environment")
const { getGlobalDB } = require("../../../tenancy")

async function fetchGoogleCreds() {
  // try and get the config from the tenant
  const db = getGlobalDB()
  const googleConfig = await getScopedConfig(db, {
    type: Configs.GOOGLE,
  })
  // or fall back to env variables
  return (
    googleConfig || {
      clientID: environment.GOOGLE_CLIENT_ID,
      clientSecret: environment.GOOGLE_CLIENT_SECRET,
    }
  )
}

async function getPlatformUrl() {
  let platformUrl = environment.PLATFORM_URL || "http://localhost:10000"

  const db = getGlobalDB()
  const settings = await getScopedConfig(db, {
    type: Configs.SETTINGS,
  })

  // self hosted - check for platform url override
  if (settings && settings.platformUrl) {
    platformUrl = settings.platformUrl
  }

  return platformUrl
}

async function preAuth(passport, ctx, next) {
  // get the relevant config
  const googleConfig = await fetchGoogleCreds()
  const platformUrl = await getPlatformUrl()

  let callbackUrl = `${platformUrl}/api/global/auth/datasource/google/callback`
  const strategy = await google.strategyFactory(googleConfig, callbackUrl)

  if (!ctx.query.appId || !ctx.query.datasourceId) {
    ctx.throw(400, "appId and datasourceId query params not present.")
  }

  return passport.authenticate(strategy, {
    scope: ["profile", "email", "https://www.googleapis.com/auth/spreadsheets"],
    accessType: "offline",
    prompt: "consent",
  })(ctx, next)
}

async function postAuth(passport, ctx, next) {
  // get the relevant config
  const config = await fetchGoogleCreds()
  const platformUrl = await getPlatformUrl()

  let callbackUrl = `${platformUrl}/api/global/auth/datasource/google/callback`
  const strategy = await google.strategyFactory(
    config,
    callbackUrl,
    (accessToken, refreshToken, profile, done) => {
      clearCookie(ctx, Cookies.DatasourceAuth)
      done(null, { refreshToken })
    }
  )

  const authStateCookie = getCookie(ctx, Cookies.DatasourceAuth)

  return passport.authenticate(
    strategy,
    { successRedirect: "/", failureRedirect: "/error" },
    async (err, tokens) => {
      // update the DB for the datasource with all the user info
      await doWithDB(authStateCookie.appId, async db => {
        const datasource = await db.get(authStateCookie.datasourceId)
        if (!datasource.config) {
          datasource.config = {}
        }
        datasource.config.auth = { type: "google", ...tokens }
        await db.put(datasource)
        ctx.redirect(
          `/builder/app/${authStateCookie.appId}/data/datasource/${authStateCookie.datasourceId}`
        )
      })
    }
  )(ctx, next)
}

exports.preAuth = preAuth
exports.postAuth = postAuth
