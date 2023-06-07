import * as google from "../sso/google"
import { Cookie } from "../../../constants"
import { clearCookie, getCookie } from "../../../utils"
import { doWithDB } from "../../../db"
import * as configs from "../../../configs"
import { BBContext, Database, SSOProfile } from "@budibase/types"
import { ssoSaveUserNoOp } from "../sso/sso"
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

  if (!ctx.query.appId || !ctx.query.datasourceId) {
    ctx.throw(400, "appId and datasourceId query params not present.")
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
        profile: SSOProfile,
        done: Function
      ) => {
        clearCookie(ctx, Cookie.DatasourceAuth)
        done(null, { accessToken, refreshToken })
      }
    ),
    { successRedirect: "/", failureRedirect: "/error" },
    async (err: any, tokens: string[]) => {
      const baseUrl = `/builder/app/${authStateCookie.appId}/data`
      // update the DB for the datasource with all the user info
      await doWithDB(authStateCookie.appId, async (db: Database) => {
        let datasource
        try {
          datasource = await db.get(authStateCookie.datasourceId)
        } catch (err: any) {
          if (err.status === 404) {
            ctx.redirect(baseUrl)
          }
        }
        if (!datasource.config) {
          datasource.config = {}
        }
        datasource.config.auth = { type: "google", ...tokens }
        await db.put(datasource)
        ctx.redirect(`${baseUrl}/datasource/${authStateCookie.datasourceId}`)
      })
    }
  )(ctx, next)
}
