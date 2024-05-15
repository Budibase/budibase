const _passport = require("koa-passport")
const LocalStrategy = require("passport-local").Strategy

import { getGlobalDB } from "../context"
import { Cookie } from "../constants"
import { getSessionsForUser, invalidateSessions } from "../security/sessions"
import {
  authenticated,
  csrf,
  google,
  local,
  oidc,
  tenancy,
} from "../middleware"
import * as userCache from "../cache/user"
import { invalidateUser } from "../cache/user"
import {
  ConfigType,
  GoogleInnerConfig,
  OIDCInnerConfig,
  PlatformLogoutOpts,
  SessionCookie,
  SSOProviderType,
} from "@budibase/types"
import * as events from "../events"
import * as configs from "../configs"
import { clearCookie, getCookie } from "../utils"
import { ssoSaveUserNoOp } from "../middleware/passport/sso/sso"

const refresh = require("passport-oauth2-refresh")

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

// Strategies
_passport.use(new LocalStrategy(local.options, local.authenticate))

async function refreshOIDCAccessToken(
  chosenConfig: OIDCInnerConfig,
  refreshToken: string
): Promise<RefreshResponse> {
  const callbackUrl = await oidc.getCallbackUrl()
  let enrichedConfig: any
  let strategy: any

  try {
    enrichedConfig = await oidc.fetchStrategyConfig(chosenConfig, callbackUrl)
    if (!enrichedConfig) {
      throw new Error("OIDC Config contents invalid")
    }
    strategy = await oidc.strategyFactory(enrichedConfig, ssoSaveUserNoOp)
  } catch (err) {
    throw new Error("Could not refresh OAuth Token")
  }

  refresh.use(strategy, {
    setRefreshOAuth2() {
      return strategy._getOAuth2Client(enrichedConfig)
    },
  })

  return new Promise(resolve => {
    refresh.requestNewAccessToken(
      ConfigType.OIDC,
      refreshToken,
      (err: any, accessToken: string, refreshToken: any, params: any) => {
        resolve({ err, accessToken, refreshToken, params })
      }
    )
  })
}

async function refreshGoogleAccessToken(
  config: GoogleInnerConfig,
  refreshToken: any
): Promise<RefreshResponse> {
  let callbackUrl = await google.getCallbackUrl(config)

  let strategy
  try {
    strategy = await google.strategyFactory(
      config,
      callbackUrl,
      ssoSaveUserNoOp
    )
  } catch (err: any) {
    throw new Error(
      `Error constructing OIDC refresh strategy: message=${err.message}`
    )
  }

  refresh.use(strategy)

  return new Promise(resolve => {
    refresh.requestNewAccessToken(
      ConfigType.GOOGLE,
      refreshToken,
      (err: any, accessToken: string, refreshToken: string, params: any) => {
        resolve({ err, accessToken, refreshToken, params })
      }
    )
  })
}

interface RefreshResponse {
  err?: {
    data?: string
  }
  accessToken?: string
  refreshToken?: string
  params?: any
}

export async function refreshOAuthToken(
  refreshToken: string,
  providerType: SSOProviderType,
  configId?: string
): Promise<RefreshResponse> {
  switch (providerType) {
    case SSOProviderType.OIDC: {
      if (!configId) {
        return { err: { data: "OIDC config id not provided" } }
      }
      const oidcConfig = await configs.getOIDCConfigById(configId)
      if (!oidcConfig) {
        return { err: { data: "OIDC configuration not found" } }
      }
      return refreshOIDCAccessToken(oidcConfig, refreshToken)
    }
    case SSOProviderType.GOOGLE: {
      let googleConfig = await configs.getGoogleConfig()
      if (!googleConfig) {
        return { err: { data: "Google configuration not found" } }
      }
      return refreshGoogleAccessToken(googleConfig, refreshToken)
    }
  }
}

// TODO: Refactor to use user save function instead to prevent the need for
// manually saving and invalidating on callback
export async function updateUserOAuth(userId: string, oAuthConfig: any) {
  const details = {
    accessToken: oAuthConfig.accessToken,
    refreshToken: oAuthConfig.refreshToken,
  }

  try {
    const db = getGlobalDB()
    const dbUser = await db.get<any>(userId)

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

/**
 * Logs a user out from budibase. Re-used across account portal and builder.
 */
export async function platformLogout(opts: PlatformLogoutOpts) {
  const ctx = opts.ctx
  const userId = opts.userId
  const keepActiveSession = opts.keepActiveSession

  if (!ctx) throw new Error("Koa context must be supplied to logout.")

  const currentSession = getCookie<SessionCookie>(ctx, Cookie.Auth)
  let sessions = await getSessionsForUser(userId)

  if (currentSession && keepActiveSession) {
    sessions = sessions.filter(
      session => session.sessionId !== currentSession.sessionId
    )
  } else {
    // clear cookies
    clearCookie(ctx, Cookie.Auth)
  }

  const sessionIds = sessions.map(({ sessionId }) => sessionId)
  await invalidateSessions(userId, { sessionIds, reason: "logout" })
  await events.auth.logout(ctx.user?.email)
  await userCache.invalidateUser(userId)
}
