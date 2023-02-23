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
} from "@budibase/types"
import env from "../../../environment"

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
    console.error("Authentication error")
    console.error(err)
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
  // get rid of any app cookies on login
  // have to check test because this breaks cypress
  if (!env.isTest()) {
    clearCookie(ctx, Cookie.CurrentApp)
  }
}

export const login = async (ctx: Ctx<LoginRequest>, next: any) => {
  const email = ctx.request.body.username

  const user = await userSdk.getUserByEmail(email)
  if (user && (await userSdk.isPreventSSOPasswords(user))) {
    ctx.throw(400, "SSO user cannot login using password")
  }

  return passport.authenticate(
    "local",
    async (err: any, user: User, info: any) => {
      await passportCallback(ctx, user, err, info)
      await context.identity.doInUserContext(user, async () => {
        await events.auth.login("local")
      })
      ctx.status = 200
    }
  )(ctx, next)
}

export const logout = async (ctx: any) => {
  if (ctx.user && ctx.user._id) {
    await authSdk.logout({ ctx, userId: ctx.user._id })
  }
  ctx.body = { message: "User logged out." }
}

// INIT

export const setInitInfo = (ctx: any) => {
  const initInfo = ctx.request.body
  setCookie(ctx, initInfo, Cookie.Init)
  ctx.status = 200
}

export const getInitInfo = (ctx: any) => {
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
export const reset = async (ctx: Ctx<PasswordResetRequest>) => {
  const { email } = ctx.request.body

  await authSdk.reset(email)

  ctx.body = {
    message: "Please check your email for a reset link.",
  }
}

/**
 * Perform the user password update if the provided reset code is valid.
 */
export const resetUpdate = async (ctx: Ctx<PasswordResetUpdateRequest>) => {
  const { resetCode, password } = ctx.request.body
  try {
    await authSdk.resetUpdate(resetCode, password)
    ctx.body = {
      message: "password reset successfully.",
    }
  } catch (err) {
    console.warn(err)
    // hide any details of the error for security
    ctx.throw(400, "Cannot reset password.")
  }
}

// DATASOURCE

export const datasourcePreAuth = async (ctx: any, next: any) => {
  const provider = ctx.params.provider
  const { middleware } = require(`@budibase/backend-core`)
  const handler = middleware.datasource[provider]

  setCookie(
    ctx,
    {
      provider,
      appId: ctx.query.appId,
      datasourceId: ctx.query.datasourceId,
    },
    Cookie.DatasourceAuth
  )

  return handler.preAuth(passport, ctx, next)
}

export const datasourceAuth = async (ctx: any, next: any) => {
  const authStateCookie = getCookie(ctx, Cookie.DatasourceAuth)
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
export const googlePreAuth = async (ctx: any, next: any) => {
  const config = await configs.getGoogleConfig()
  if (!config) {
    return ctx.throw(400, "Google config not found")
  }
  let callbackUrl = await googleCallbackUrl(config)
  const strategy = await google.strategyFactory(
    config,
    callbackUrl,
    userSdk.save
  )

  return passport.authenticate(strategy, {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })(ctx, next)
}

export const googleCallback = async (ctx: any, next: any) => {
  const config = await configs.getGoogleConfig()
  if (!config) {
    return ctx.throw(400, "Google config not found")
  }
  const callbackUrl = await googleCallbackUrl(config)
  const strategy = await google.strategyFactory(
    config,
    callbackUrl,
    userSdk.save
  )

  return passport.authenticate(
    strategy,
    { successRedirect: "/", failureRedirect: "/error" },
    async (err: any, user: SSOUser, info: any) => {
      await passportCallback(ctx, user, err, info)
      await context.identity.doInUserContext(user, async () => {
        await events.auth.login("google-internal")
      })
      ctx.redirect("/")
    }
  )(ctx, next)
}

// OIDC SSO

export async function oidcCallbackUrl() {
  return ssoCallbackUrl(ConfigType.OIDC)
}

export const oidcStrategyFactory = async (ctx: any, configId: any) => {
  const config = await configs.getOIDCConfig()
  if (!config) {
    return ctx.throw(400, "OIDC config not found")
  }

  let callbackUrl = await oidcCallbackUrl()

  //Remote Config
  const enrichedConfig = await oidc.fetchStrategyConfig(config, callbackUrl)
  return oidc.strategyFactory(enrichedConfig, userSdk.save)
}

/**
 * The initial call that OIDC authentication makes to take you to the configured OIDC login screen.
 * On a successful login, you will be redirected to the oidcAuth callback route.
 */
export const oidcPreAuth = async (ctx: Ctx, next: any) => {
  const { configId } = ctx.params
  if (!configId) {
    ctx.throw(400, "OIDC config id is required")
  }
  const strategy = await oidcStrategyFactory(ctx, configId)

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

export const oidcCallback = async (ctx: any, next: any) => {
  const configId = getCookie(ctx, Cookie.OIDC_CONFIG)
  const strategy = await oidcStrategyFactory(ctx, configId)

  return passport.authenticate(
    strategy,
    { successRedirect: "/", failureRedirect: "/error" },
    async (err: any, user: SSOUser, info: any) => {
      await passportCallback(ctx, user, err, info)
      await context.identity.doInUserContext(user, async () => {
        await events.auth.login("oidc")
      })
      ctx.redirect("/")
    }
  )(ctx, next)
}
