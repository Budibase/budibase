import {
  auth as authCore,
  constants,
  context,
  events,
  utils as utilsCore,
  configs,
  cache,
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

const normalizeEmail = (e: string) => (e || "").toLowerCase()
const failKey = (email: string) => `auth:login:fail:${normalizeEmail(email)}`
const lockKey = (email: string) => `auth:login:lock:${normalizeEmail(email)}`
const isLocked = async (email: string) => {
  return !!(await cache.get(lockKey(email)))
}

const handleLockoutResponse = (ctx: Ctx, email: string) => {
  ctx.set("X-Account-Locked", "1")
  ctx.set("Retry-After", String(env.LOGIN_LOCKOUT_SECONDS))
  console.log(
    `[auth] login blocked (post-failure) due to lock email=${normalizeEmail(email)}`
  )
  return ctx.throw(403, "Account temporarily locked. Try again later.")
}
const onFailed = async (email: string) => {
  if (!email) return
  const key = failKey(email)
  const currentAttempt = Number((await cache.get(key)) || 0) || 0
  const nextAttempt = currentAttempt + 1
  await cache.store(key, nextAttempt, env.LOGIN_LOCKOUT_SECONDS)
  console.log(
    `[auth] failed login email=${normalizeEmail(email)} count=${nextAttempt}`
  )
  if (nextAttempt >= env.LOGIN_MAX_FAILED_ATTEMPTS) {
    await cache.store(lockKey(email), "1", env.LOGIN_LOCKOUT_SECONDS)
    await cache.destroy(key)
    console.log(
      `[auth] account locked email=${normalizeEmail(email)} for ${env.LOGIN_LOCKOUT_SECONDS}s`
    )
  }
}
const clearFailureState = async (email: string) => {
  if (!email) return
  await cache.destroy(failKey(email))
  await cache.destroy(lockKey(email))
}

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

  const loginResult = await authSdk.loginUser(user)

  // set a cookie for browser access
  setCookie(ctx, loginResult.token, Cookie.Auth, { sign: false })
  // set the token in a header as well for APIs
  ctx.set(Header.TOKEN, loginResult.token)

  // add session invalidation info to response headers for frontend to handle
  if (loginResult.invalidatedSessionCount > 0) {
    ctx.set(
      "X-Session-Invalidated-Count",
      loginResult.invalidatedSessionCount.toString()
    )
  }
}

export const login = async (
  ctx: Ctx<LoginRequest, LoginResponse>,
  next: Next
) => {
  const email = ctx.request.body.username

  const dbUser = await userSdk.db.getUserByEmail(email)
  if (dbUser && (await userSdk.db.isPreventPasswordActions(dbUser))) {
    console.log(
      `[auth] login prevented due to sso enforcement email=${normalizeEmail(email)}`
    )
    ctx.throw(403, "Invalid credentials")
  }

  return passport.authenticate(
    "local",
    async (err: any, user: User, info: any) => {
      if (err || !user) {
        if (dbUser) {
          await onFailed(email)
        }
        if (await isLocked(email)) {
          return handleLockoutResponse(ctx, email)
        }
        const reason =
          (info && info.message) || (err && err.message) || "unknown"
        console.log(
          `[auth] password auth failed email=${normalizeEmail(email)} reason=${reason}`
        )
        // delegate to shared passport failure handling to preserve specific messages (e.g. expired)
        return passportCallback(ctx, user as any, err, info)
      }

      await clearFailureState(email)
      console.log(
        `[auth] password auth success email=${normalizeEmail(user.email)}`
      )
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

  const lcEmail = (email || "").toLowerCase()
  const ip = (ctx.ip || "").toString()

  // rate limit keys
  const emailKey = `auth:pwdreset:email:${lcEmail}`
  const ipKey = `auth:pwdreset:ip:${ip}`

  const increment = async (key: string, windowSeconds: number) => {
    const currentAttempt = Number((await cache.get(key)) || 0) || 0
    const nextAttempt = currentAttempt + 1
    await cache.store(key, nextAttempt, windowSeconds)
    return nextAttempt
  }

  // apply per-email and per-ip rate limits
  const nextEmail = await increment(
    emailKey,
    env.PASSWORD_RESET_RATE_EMAIL_WINDOW_SECONDS
  )
  const nextIp = await increment(
    ipKey,
    env.PASSWORD_RESET_RATE_IP_WINDOW_SECONDS
  )

  const emailLimited = nextEmail > env.PASSWORD_RESET_RATE_EMAIL_LIMIT
  const ipLimited = nextIp > env.PASSWORD_RESET_RATE_IP_LIMIT

  if (emailLimited || ipLimited) {
    // surfaced for ui to display
    ctx.set(
      "X-RateLimit-Email-Limit",
      String(env.PASSWORD_RESET_RATE_EMAIL_LIMIT)
    )
    ctx.set(
      "X-RateLimit-Email-Remaining",
      String(Math.max(env.PASSWORD_RESET_RATE_EMAIL_LIMIT - nextEmail, 0))
    )
    ctx.set("X-RateLimit-IP-Limit", String(env.PASSWORD_RESET_RATE_IP_LIMIT))
    ctx.set(
      "X-RateLimit-IP-Remaining",
      String(Math.max(env.PASSWORD_RESET_RATE_IP_LIMIT - nextIp, 0))
    )
    // best-effort retry window
    const retryAfter = Math.max(
      env.PASSWORD_RESET_RATE_EMAIL_WINDOW_SECONDS,
      env.PASSWORD_RESET_RATE_IP_WINDOW_SECONDS
    )
    ctx.set("Retry-After", String(retryAfter))
    console.log(
      `[auth] password reset rate limited email=${lcEmail} ip=${ip} emailCount=${nextEmail} ipCount=${nextIp}`
    )
    return ctx.throw(429, "Too many password reset requests. Try again later.")
  }

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

      const returnUrl = ctx.cookies.get(Cookie.ReturnUrl)
      if (returnUrl) {
        clearCookie(ctx, Cookie.ReturnUrl)
        ctx.redirect(returnUrl)
      } else {
        ctx.redirect(env.PASSPORT_GOOGLEAUTH_SUCCESS_REDIRECT)
      }
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

      const returnUrl = ctx.cookies.get(Cookie.ReturnUrl)
      if (returnUrl) {
        clearCookie(ctx, Cookie.ReturnUrl)
        ctx.redirect(returnUrl)
      } else {
        ctx.redirect(env.PASSPORT_OIDCAUTH_SUCCESS_REDIRECT)
      }
    }
  )(ctx, next)
}
