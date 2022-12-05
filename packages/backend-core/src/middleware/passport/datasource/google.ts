import * as google from "../google"
import { Cookie, Config } from "../../../constants"
import { clearCookie, getCookie } from "../../../utils"
import { getScopedConfig, getPlatformUrl, doWithDB } from "../../../db"
import environment from "../../../environment"
import { getGlobalDB } from "../../../tenancy"
import { BBContext, Database, SSOProfile } from "@budibase/types"
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy

type Passport = {
  authenticate: any
}

async function fetchGoogleCreds() {
  // try and get the config from the tenant
  const db = getGlobalDB()
  const googleConfig = await getScopedConfig(db, {
    type: Config.GOOGLE,
  })
  // or fall back to env variables
  return (
    googleConfig || {
      clientID: environment.GOOGLE_CLIENT_ID,
      clientSecret: environment.GOOGLE_CLIENT_SECRET,
    }
  )
}

export async function preAuth(
  passport: Passport,
  ctx: BBContext,
  next: Function
) {
  // get the relevant config
  const googleConfig = await fetchGoogleCreds()
  const platformUrl = await getPlatformUrl({ tenantAware: false })

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

export async function postAuth(
  passport: Passport,
  ctx: BBContext,
  next: Function
) {
  // get the relevant config
  const config = await fetchGoogleCreds()
  const platformUrl = await getPlatformUrl({ tenantAware: false })

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
      // update the DB for the datasource with all the user info
      await doWithDB(authStateCookie.appId, async (db: Database) => {
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
