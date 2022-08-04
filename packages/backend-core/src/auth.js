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
  ssoCallbackUrl,
  csrf,
  internalApi,
  adminOnly,
  builderOnly,
  builderOrAdmin,
  joiValidator,
} = require("./middleware")

const { invalidateUser } = require("./cache/user")

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

async function refreshOIDCAccessToken(db, chosenConfig, refreshToken) {
  const callbackUrl = await oidc.getCallbackUrl(db, chosenConfig)
  let enrichedConfig
  let strategy

  try {
    enrichedConfig = await oidc.fetchStrategyConfig(chosenConfig, callbackUrl)
    if (!enrichedConfig) {
      throw new Error("OIDC Config contents invalid")
    }
    strategy = await oidc.strategyFactory(enrichedConfig)
  } catch (err) {
    console.error(err)
    throw new Error("Could not refresh OAuth Token")
  }

  refresh.use(strategy, {
    setRefreshOAuth2() {
      return strategy._getOAuth2Client(enrichedConfig)
    },
  })

  return new Promise(resolve => {
    refresh.requestNewAccessToken(
      Configs.OIDC,
      refreshToken,
      (err, accessToken, refreshToken, params) => {
        resolve({ err, accessToken, refreshToken, params })
      }
    )
  })
}

async function refreshGoogleAccessToken(db, config, refreshToken) {
  let callbackUrl = await google.getCallbackUrl(db, config)

  let strategy
  try {
    strategy = await google.strategyFactory(config, callbackUrl)
  } catch (err) {
    console.error(err)
    throw new Error("Error constructing OIDC refresh strategy", err)
  }

  refresh.use(strategy)

  return new Promise(resolve => {
    refresh.requestNewAccessToken(
      Configs.GOOGLE,
      refreshToken,
      (err, accessToken, refreshToken, params) => {
        resolve({ err, accessToken, refreshToken, params })
      }
    )
  })
}

async function refreshOAuthToken(refreshToken, configType, configId) {
  const db = getGlobalDB()

  const config = await getScopedConfig(db, {
    type: configType,
    group: {},
  })

  let chosenConfig = {}
  let refreshResponse
  if (configType === Configs.OIDC) {
    // configId - retrieved from cookie.
    chosenConfig = config.configs.filter(c => c.uuid === configId)[0]
    if (!chosenConfig) {
      throw new Error("Invalid OIDC configuration")
    }
    refreshResponse = await refreshOIDCAccessToken(
      db,
      chosenConfig,
      refreshToken
    )
  } else {
    chosenConfig = config
    refreshResponse = await refreshGoogleAccessToken(
      db,
      chosenConfig,
      refreshToken
    )
  }

  return refreshResponse
}

async function updateUserOAuth(userId, oAuthConfig) {
  const details = {
    accessToken: oAuthConfig.accessToken,
    refreshToken: oAuthConfig.refreshToken,
  }

  try {
    const db = getGlobalDB()
    const dbUser = await db.get(userId)

    //Do not overwrite the refresh token if a valid one is not provided.
    if (typeof details.refreshToken !== "string") {
      delete details.refreshToken
    }

    dbUser.oauth2 = {
      ...dbUser.oauth2,
      ...details,
    }

    await db.put(dbUser)

    await invalidateUser(userId)
  } catch (e) {
    console.error("Could not update OAuth details for current user", e)
  }
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
  refreshOAuthToken,
  updateUserOAuth,
  ssoCallbackUrl,
  adminOnly,
  builderOnly,
  builderOrAdmin,
  joiValidator,
}
