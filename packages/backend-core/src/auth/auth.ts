const _passport = require("koa-passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
import { getGlobalDB } from "../tenancy"
const refresh = require("passport-oauth2-refresh")
import { Config } from "../constants"
import { getScopedConfig } from "../db"
import {
  jwt as jwtPassport,
  local,
  authenticated,
  auditLog,
  tenancy,
  authError,
  ssoCallbackUrl,
  csrf,
  internalApi,
  adminOnly,
  builderOnly,
  builderOrAdmin,
  joiValidator,
  oidc,
  google,
} from "../middleware"
import { invalidateUser } from "../cache/user"
import { User } from "@budibase/types"
import { logAlert } from "../logging"
export {
  auditLog,
  authError,
  internalApi,
  ssoCallbackUrl,
  adminOnly,
  builderOnly,
  builderOrAdmin,
  joiValidator,
  google,
  oidc,
} from "../middleware"
export const buildAuthMiddleware = authenticated
export const buildTenancyMiddleware = tenancy
export const buildCsrfMiddleware = csrf
export const passport = _passport
export const jwt = require("jsonwebtoken")

// Strategies
_passport.use(new LocalStrategy(local.options, local.authenticate))
if (jwtPassport.options.secretOrKey) {
  _passport.use(new JwtStrategy(jwtPassport.options, jwtPassport.authenticate))
} else {
  logAlert("No JWT Secret supplied, cannot configure JWT strategy")
}

_passport.serializeUser((user: User, done: any) => done(null, user))

_passport.deserializeUser(async (user: User, done: any) => {
  const db = getGlobalDB()

  try {
    const dbUser = await db.get(user._id)
    return done(null, dbUser)
  } catch (err) {
    console.error(`User not found`, err)
    return done(null, false, { message: "User not found" })
  }
})

async function refreshOIDCAccessToken(
  db: any,
  chosenConfig: any,
  refreshToken: string
) {
  const callbackUrl = await oidc.getCallbackUrl(db, chosenConfig)
  let enrichedConfig: any
  let strategy: any

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
      Config.OIDC,
      refreshToken,
      (err: any, accessToken: string, refreshToken: any, params: any) => {
        resolve({ err, accessToken, refreshToken, params })
      }
    )
  })
}

async function refreshGoogleAccessToken(
  db: any,
  config: any,
  refreshToken: any
) {
  let callbackUrl = await google.getCallbackUrl(db, config)

  let strategy
  try {
    strategy = await google.strategyFactory(config, callbackUrl)
  } catch (err: any) {
    console.error(err)
    throw new Error(
      `Error constructing OIDC refresh strategy: message=${err.message}`
    )
  }

  refresh.use(strategy)

  return new Promise(resolve => {
    refresh.requestNewAccessToken(
      Config.GOOGLE,
      refreshToken,
      (err: any, accessToken: string, refreshToken: string, params: any) => {
        resolve({ err, accessToken, refreshToken, params })
      }
    )
  })
}

export async function refreshOAuthToken(
  refreshToken: string,
  configType: string,
  configId: string
) {
  const db = getGlobalDB()

  const config = await getScopedConfig(db, {
    type: configType,
    group: {},
  })

  let chosenConfig = {}
  let refreshResponse
  if (configType === Config.OIDC) {
    // configId - retrieved from cookie.
    chosenConfig = config.configs.filter((c: any) => c.uuid === configId)[0]
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

export async function updateUserOAuth(userId: string, oAuthConfig: any) {
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
