import {
  auth as authCore,
  constants,
  context,
  events,
  utils as utilsCore,
  configs,
} from "@budibase/backend-core"
import {
  ConfigType,
  User,
  Ctx,
  LoginRequest,
  SSOUser,
  PasswordResetRequest,
  PasswordResetUpdateRequest,
  GoogleInnerConfig,
  DatasourceAuthCookie,
  LogoutResponse,
  UserCtx,
  SetInitInfoRequest,
  GetInitInfoResponse,
  PasswordResetResponse,
  PasswordResetUpdateResponse,
  SetInitInfoResponse,
  LoginResponse,
} from "@budibase/types"
import env from "../../../environment"
import { Next } from "koa"

import * as authSdk from "../../../sdk/auth"
import * as userSdk from "../../../sdk/users"

const { Cookie, Header } = constants
const { passport, ssoCallbackUrl, google, oidc } = authCore
const { setCookie, getCookie, clearCookie } = utilsCore

// LOGIN / LOGOUT

async function passportCallback(
  ctx: Ctx,
  user: User,
  err: any = null,
  info: { message: string } | null = null
) {
  if (err) {
    console.error("Authentication error", err)
    console.trace(err)
    return ctx.throw(403, info ? info : "Unauthorized")
  }
  if (!user) {
    console.error("Authentication error - no user provided")
    return ctx.throw(403, info ? info : "Unauthorized")
  }

  const token = await authSdk.loginUser(user)

  // set a cookie for browser access
  setCookie(ctx, token, Cookie.Auth, { sign: false })
  // set the token in a header as well for APIs
  ctx.set(Header.TOKEN, token)
}

export const login = async (
  ctx: Ctx<LoginRequest, LoginResponse>,
  next: Next
) => {
  const email = ctx.request.body.username

  const user = await userSdk.db.getUserByEmail(email)
  if (user && (await userSdk.db.isPreventPasswordActions(user))) {
    ctx.throw(403, "Invalid credentials")
  }

  return passport.authenticate(
    "local",
    async (err: any, user: User, info: any) => {
      await passportCallback(ctx, user, err, info)
      await context.identity.doInUserContext(user, ctx, async () => {
        await events.auth.login("local", user.email)
      })
      ctx.body = {
        message: "Login successful",
        userId: user.userId,
      }
    }
  )(ctx, next)
}

export const logout = async (ctx: UserCtx<void, LogoutResponse>) => {
  if (ctx.user && ctx.user._id) {
    await authSdk.logout({ ctx, userId: ctx.user._id })
  }
  ctx.body = { message: "User logged out." }
}

// INIT

export const setInitInfo = (
  ctx: UserCtx<SetInitInfoRequest, SetInitInfoResponse>
) => {
  const initInfo = ctx.request.body
  setCookie(ctx, initInfo, Cookie.Init)
  ctx.body = {
    message: "Init info updated.",
  }
}

export const getInitInfo = (ctx: UserCtx<void, GetInitInfoResponse>) => {
  try {
    ctx.body = getCookie(ctx, Cookie.Init) || {}
  } catch (err) {
    clearCookie(ctx, Cookie.Init)
    ctx.body = {}
  }
}

// PASSWORD MANAGEMENT

/**
 * Reset the user password, used as part of a forgotten password flow.
 */
export const reset = async (
  ctx: Ctx<PasswordResetRequest, PasswordResetResponse>
) => {
  const { email } = ctx.request.body

  await authSdk.reset(email)

  ctx.body = {
    message: "Please check your email for a reset link.",
  }
}

/**
 * Perform the user password update if the provided reset code is valid.
 */
export const resetUpdate = async (
  ctx: Ctx<PasswordResetUpdateRequest, PasswordResetUpdateResponse>
) => {
  const { resetCode, password } = ctx.request.body
  try {
    await authSdk.resetUpdate(resetCode, password)
    ctx.body = {
      message: "password reset successfully.",
    }
  } catch (err: any) {
    console.warn(err)
    // hide any details of the error for security
    ctx.throw(400, err.message || "Cannot reset password.")
  }
}

// DATASOURCE

export const datasourcePreAuth = async (
  ctx: UserCtx<void, void>,
  next: Next
) => {
  const provider = ctx.params.provider
  const { middleware } = require(`@budibase/backend-core`)
  const handler = middleware.datasource[provider]

  setCookie(
    ctx,
    {
      provider,
      appId: ctx.query.appId,
    },
    Cookie.DatasourceAuth
  )

  return handler.preAuth(passport, ctx, next)
}

export const datasourceAuth = async (ctx: UserCtx<void, void>, next: Next) => {
  const authStateCookie = getCookie<DatasourceAuthCookie>(
    ctx,
    Cookie.DatasourceAuth
  )
  if (!authStateCookie) {
    throw new Error("Unable to retrieve datasource authentication cookie")
  }
  const provider = authStateCookie.provider
  const { middleware } = require(`@budibase/backend-core`)
  const handler = middleware.datasource[provider]
  return handler.postAuth(passport, ctx, next)
}

// GOOGLE SSO

export async function googleCallbackUrl(config?: GoogleInnerConfig) {
  return ssoCallbackUrl(ConfigType.GOOGLE, config)
}

/**
 * The initial call that google authentication makes to take you to the google login screen.
 * On a successful login, you will be redirected to the googleAuth callback route.
 */
export const googlePreAuth = async (ctx: Ctx<void, void>, next: Next) => {
  const config = await configs.getGoogleConfig()
  if (!config) {
    return ctx.throw(400, "Google config not found")
  }
  let callbackUrl = await googleCallbackUrl(config)
  const strategy = await google.strategyFactory(
    config,
    callbackUrl,
    userSdk.db.save
  )

  return passport.authenticate(strategy, {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })(ctx, next)
}

export const googleCallback = async (ctx: Ctx<void, void>, next: Next) => {
  const config = await configs.getGoogleConfig()
  if (!config) {
    return ctx.throw(400, "Google config not found")
  }
  const callbackUrl = await googleCallbackUrl(config)
  const strategy = await google.strategyFactory(
    config,
    callbackUrl,
    userSdk.db.save
  )

  return passport.authenticate(
    strategy,
    {
      successRedirect: env.PASSPORT_GOOGLEAUTH_SUCCESS_REDIRECT,
      failureRedirect: env.PASSPORT_GOOGLEAUTH_FAILURE_REDIRECT,
    },
    async (err: any, user: SSOUser, info: any) => {
      await passportCallback(ctx, user, err, info)
      await context.identity.doInUserContext(user, ctx, async () => {
        await events.auth.login("google-internal", user.email)
      })
      ctx.redirect(env.PASSPORT_GOOGLEAUTH_SUCCESS_REDIRECT)
    }
  )(ctx, next)
}

// OIDC SSO

export async function oidcCallbackUrl() {
  return ssoCallbackUrl(ConfigType.OIDC)
}

export const oidcStrategyFactory = async (ctx: any) => {
  const config = await configs.getOIDCConfig()
  if (!config) {
    return ctx.throw(400, "OIDC config not found")
  }

  let callbackUrl = await oidcCallbackUrl()

  //Remote Config
  const enrichedConfig = await oidc.fetchStrategyConfig(config, callbackUrl)
  return oidc.strategyFactory(enrichedConfig, userSdk.db.save)
}

/**
 * The initial call that OIDC authentication makes to take you to the configured OIDC login screen.
 * On a successful login, you will be redirected to the oidcAuth callback route.
 */
export const oidcPreAuth = async (ctx: Ctx<void, void>, next: Next) => {
  const { configId } = ctx.params
  if (!configId) {
    ctx.throw(400, "OIDC config id is required")
  }
  const strategy = await oidcStrategyFactory(ctx)

  setCookie(ctx, configId, Cookie.OIDC_CONFIG)

  const config = await configs.getOIDCConfigById(configId)
  if (!config) {
    return ctx.throw(400, "OIDC config not found")
  }

  let authScopes =
    config.scopes?.length > 0
      ? config.scopes
      : ["profile", "email", "offline_access"]

  return passport.authenticate(strategy, {
    // required 'openid' scope is added by oidc strategy factory
    scope: authScopes,
  })(ctx, next)
}

export const oidcCallback = async (ctx: Ctx<void, void>, next: Next) => {
  const strategy = await oidcStrategyFactory(ctx)

  return passport.authenticate(
    strategy,
    {
      successRedirect: env.PASSPORT_OIDCAUTH_SUCCESS_REDIRECT,
      failureRedirect: env.PASSPORT_OIDCAUTH_FAILURE_REDIRECT,
    },
    async (err: any, user: SSOUser, info: any) => {
      await passportCallback(ctx, user, err, info)
      await context.identity.doInUserContext(user, ctx, async () => {
        await events.auth.login("oidc", user.email)
      })
      ctx.redirect(env.PASSPORT_OIDCAUTH_SUCCESS_REDIRECT)
    }
  )(ctx, next)
}
