import * as google from "../sso/google"
import { Cookie } from "../../../constants"
import { clearCookie, getCookie } from "../../../utils"
import * as configs from "../../../configs"
import { BBContext, SSOProfile } from "@budibase/types"
import { ssoSaveUserNoOp } from "../sso/sso"
import { cache, utils } from "../../../"
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy

type Passport = {
  authenticate: any
}

async function fetchGoogleCreds() {
  let config = await configs.getGoogleDatasourceConfig()

  if (!config) {
    throw new Error("No google configuration found")
  }
  return config
}

export async function preAuth(
  passport: Passport,
  ctx: BBContext,
  next: Function
) {
  // get the relevant config
  const googleConfig = await fetchGoogleCreds()
  const platformUrl = await configs.getPlatformUrl({ tenantAware: false })

  let callbackUrl = `${platformUrl}/api/global/auth/datasource/google/callback`
  const strategy = await google.strategyFactory(
    googleConfig,
    callbackUrl,
    ssoSaveUserNoOp
  )

  if (!ctx.query.appId) {
    ctx.throw(400, "appId query param not present.")
  }

  return passport.authenticate(strategy, {
    scope: ["profile", "email", "https://www.googleapis.com/auth/spreadsheets"],
    accessType: "offline",
    prompt: "consent",
  })(ctx, next)
}

export async function postAuth(
  passport: Passport,
  ctx: BBContext,
  next: Function
) {
  // get the relevant config
  const config = await fetchGoogleCreds()
  const platformUrl = await configs.getPlatformUrl({ tenantAware: false })

  let callbackUrl = `${platformUrl}/api/global/auth/datasource/google/callback`
  const authStateCookie = getCookie(ctx, Cookie.DatasourceAuth)

  return passport.authenticate(
    new GoogleStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: callbackUrl,
      },
      (
        accessToken: string,
        refreshToken: string,
        _profile: SSOProfile,
        done: Function
      ) => {
        clearCookie(ctx, Cookie.DatasourceAuth)
        done(null, { accessToken, refreshToken })
      }
    ),
    { successRedirect: "/", failureRedirect: "/error" },
    async (err: any, tokens: string[]) => {
      const baseUrl = `/builder/app/${authStateCookie.appId}/data`

      const id = utils.newid()
      await cache.store(
        `datasource:creation:${authStateCookie.appId}:google:${id}`,
        {
          tokens,
        }
      )

      ctx.redirect(`${baseUrl}/new?continue_google_setup=${id}`)
    }
  )(ctx, next)
}
