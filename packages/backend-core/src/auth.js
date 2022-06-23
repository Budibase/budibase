const passport = require("koa-passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const { getGlobalDB } = require("./tenancy")
const refresh = require("passport-oauth2-refresh")
const { Configs } = require("./constants")
const { getScopedConfig } = require("./db/utils")
const {
  jwt,
  local,
  authenticated,
  google,
  oidc,
  auditLog,
  tenancy,
  appTenancy,
  authError,
  csrf,
  internalApi,
} = require("./middleware")

// Strategies
passport.use(new LocalStrategy(local.options, local.authenticate))
passport.use(new JwtStrategy(jwt.options, jwt.authenticate))

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser(async (user, done) => {
  const db = getGlobalDB()

  try {
    const user = await db.get(user._id)
    return done(null, user)
  } catch (err) {
    console.error(`User not found`, err)
    return done(null, false, { message: "User not found" })
  }
})

//requestAccessStrategy
//refreshOAuthAccessToken

//configId for google and OIDC??
async function reUpToken(refreshToken, configId) {
  const db = getGlobalDB()
  console.log(refreshToken, configId)
  const config = await getScopedConfig(db, {
    type: Configs.OIDC,
    group: {}, //ctx.query.group, this was an empty object when authentication initially
  })

  const chosenConfig = config.configs[0] //.filter((c) => c.uuid === configId)[0]
  let callbackUrl = await oidc.oidcCallbackUrl(db, chosenConfig)

  //Remote Config
  const enrichedConfig = await oidc.fetchOIDCStrategyConfig(
    chosenConfig,
    callbackUrl
  )

  const strategy = await oidc.strategyFactory(enrichedConfig, () => {
    console.log("saveFn RETURN ARGS", JSON.stringify(arguments))
  })

  try {
    refresh.use(strategy, {
      setRefreshOAuth2() {
        return strategy._getOAuth2Client(enrichedConfig)
      },
    })
    console.log("Testing")

    // By default, the strat calls itself "openidconnect"

    // refresh.requestNewAccessToken(
    //   'openidconnect',
    //   refToken,
    //   (err, accessToken, refreshToken) => {
    //     console.log("REAUTH CB", err, accessToken, refreshToken);
    //   })
  } catch (err) {
    console.error(err)
    throw new Error("Error constructing OIDC refresh strategy", err)
  }

  console.log("end")
}

module.exports = {
  buildAuthMiddleware: authenticated,
  passport,
  google,
  oidc,
  jwt: require("jsonwebtoken"),
  buildTenancyMiddleware: tenancy,
  buildAppTenancyMiddleware: appTenancy,
  auditLog,
  authError,
  buildCsrfMiddleware: csrf,
  internalApi,
  reUpToken,
}
