import { Cookie, Header } from "../constants"
import { getCookie, clearCookie, openJwt } from "../utils"
import { getUser } from "../cache/user"
import { getSession, updateSessionTTL } from "../security/sessions"
import { buildMatcherRegex, matches } from "./matchers"
import { SEPARATOR, queryGlobalView, ViewName } from "../db"
import { getGlobalDB, doInTenant } from "../tenancy"
import { decrypt } from "../security/encryption"
import * as identity from "../context/identity"
import env from "../environment"
import { BBContext, EndpointMatcher } from "@budibase/types"

const ONE_MINUTE = env.SESSION_UPDATE_PERIOD
  ? parseInt(env.SESSION_UPDATE_PERIOD)
  : 60 * 1000

interface FinaliseOpts {
  authenticated?: boolean
  internal?: boolean
  publicEndpoint?: boolean
  version?: string
  user?: any
}

function timeMinusOneMinute() {
  return new Date(Date.now() - ONE_MINUTE).toISOString()
}

function finalise(ctx: any, opts: FinaliseOpts = {}) {
  ctx.publicEndpoint = opts.publicEndpoint || false
  ctx.isAuthenticated = opts.authenticated || false
  ctx.user = opts.user
  ctx.internal = opts.internal || false
  ctx.version = opts.version
}

async function checkApiKey(apiKey: string, populateUser?: Function) {
  if (apiKey === env.INTERNAL_API_KEY) {
    return { valid: true }
  }
  const decrypted = decrypt(apiKey)
  const tenantId = decrypted.split(SEPARATOR)[0]
  return doInTenant(tenantId, async () => {
    const db = getGlobalDB()
    // api key is encrypted in the database
    const userId = (await queryGlobalView(
      ViewName.BY_API_KEY,
      {
        key: apiKey,
      },
      db
    )) as string
    if (userId) {
      return {
        valid: true,
        user: await getUser(userId, tenantId, populateUser),
      }
    } else {
      throw "Invalid API key"
    }
  })
}

/**
 * This middleware is tenancy aware, so that it does not depend on other middlewares being used.
 * The tenancy modules should not be used here and it should be assumed that the tenancy context
 * has not yet been populated.
 */
export default function (
  noAuthPatterns: EndpointMatcher[] = [],
  opts: { publicAllowed?: boolean; populateUser?: Function } = {
    publicAllowed: false,
  }
) {
  const noAuthOptions = noAuthPatterns ? buildMatcherRegex(noAuthPatterns) : []
  return async (ctx: BBContext | any, next: any) => {
    let publicEndpoint = false
    const version = ctx.request.headers[Header.API_VER]
    // the path is not authenticated
    const found = matches(ctx, noAuthOptions)
    if (found) {
      publicEndpoint = true
    }
    try {
      // check the actual user is authenticated first, try header or cookie
      const headerToken = ctx.request.headers[Header.TOKEN]
      const authCookie = getCookie(ctx, Cookie.Auth) || openJwt(headerToken)
      const apiKey = ctx.request.headers[Header.API_KEY]
      const tenantId = ctx.request.headers[Header.TENANT_ID]
      let authenticated = false,
        user = null,
        internal = false
      if (authCookie && !apiKey) {
        const sessionId = authCookie.sessionId
        const userId = authCookie.userId
        let session
        try {
          // getting session handles error checking (if session exists etc)
          session = await getSession(userId, sessionId)
          if (opts && opts.populateUser) {
            user = await getUser(
              userId,
              session.tenantId,
              opts.populateUser(ctx)
            )
          } else {
            user = await getUser(userId, session.tenantId)
          }
          user.csrfToken = session.csrfToken

          if (session?.lastAccessedAt < timeMinusOneMinute()) {
            // make sure we denote that the session is still in use
            await updateSessionTTL(session)
          }
          authenticated = true
        } catch (err: any) {
          authenticated = false
          console.error("Auth Error", err?.message || err)
          // remove the cookie as the user does not exist anymore
          clearCookie(ctx, Cookie.Auth)
        }
      }
      // this is an internal request, no user made it
      if (!authenticated && apiKey) {
        const populateUser = opts.populateUser ? opts.populateUser(ctx) : null
        const { valid, user: foundUser } = await checkApiKey(
          apiKey,
          populateUser
        )
        if (valid && foundUser) {
          authenticated = true
          user = foundUser
        } else if (valid) {
          authenticated = true
          internal = true
        }
      }
      if (!user && tenantId) {
        user = { tenantId }
      } else if (user) {
        delete user.password
      }
      // be explicit
      if (!authenticated) {
        authenticated = false
      }
      // isAuthenticated is a function, so use a variable to be able to check authed state
      finalise(ctx, { authenticated, user, internal, version, publicEndpoint })

      if (user && user.email) {
        return identity.doInUserContext(user, next)
      } else {
        return next()
      }
    } catch (err: any) {
      console.error("Auth Error", err?.message || err)
      // invalid token, clear the cookie
      if (err && err.name === "JsonWebTokenError") {
        clearCookie(ctx, Cookie.Auth)
      }
      // allow configuring for public access
      if ((opts && opts.publicAllowed) || publicEndpoint) {
        finalise(ctx, { authenticated: false, version, publicEndpoint })
        return next()
      } else {
        ctx.throw(err.status || 403, err)
      }
    }
  }
}
