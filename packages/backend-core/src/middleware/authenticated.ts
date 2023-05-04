import { Cookie, Header } from "../constants"
import {
  getCookie,
  clearCookie,
  openJwt,
  isValidInternalAPIKey,
} from "../utils"
import { getUser } from "../cache/user"
import { getSession, updateSessionTTL } from "../security/sessions"
import { buildMatcherRegex, matches } from "./matchers"
import { SEPARATOR, queryGlobalView, ViewName } from "../db"
import { getGlobalDB, doInTenant } from "../context"
import { decrypt } from "../security/encryption"
import * as identity from "../context/identity"
import env from "../environment"
import { Ctx, EndpointMatcher } from "@budibase/types"
import { InvalidAPIKeyError, ErrorCode } from "../errors"

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
  // check both the primary and the fallback internal api keys
  // this allows for rotation
  if (isValidInternalAPIKey(apiKey)) {
    return { valid: true, user: undefined }
  }
  const decrypted = decrypt(apiKey)
  const tenantId = decrypted.split(SEPARATOR)[0]
  return doInTenant(tenantId, async () => {
    let userId
    try {
      const db = getGlobalDB()
      // api key is encrypted in the database
      userId = (await queryGlobalView(
        ViewName.BY_API_KEY,
        {
          key: apiKey,
        },
        db
      )) as string
    } catch (err) {
      userId = undefined
    }
    if (userId) {
      return {
        valid: true,
        user: await getUser(userId, tenantId, populateUser),
      }
    } else {
      throw new InvalidAPIKeyError()
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
  return async (ctx: Ctx | any, next: any) => {
    let publicEndpoint = false
    const version = ctx.request.headers[Header.API_VER]
    // the path is not authenticated
    const found = matches(ctx, noAuthOptions)
    if (found) {
      publicEndpoint = true
    }
    try {
      // check the actual user is authenticated first, try header or cookie
      let headerToken = ctx.request.headers[Header.TOKEN]

      const authCookie = getCookie(ctx, Cookie.Auth) || openJwt(headerToken)
      let apiKey = ctx.request.headers[Header.API_KEY]

      if (!apiKey && ctx.request.headers[Header.AUTHORIZATION]) {
        apiKey = ctx.request.headers[Header.AUTHORIZATION].split(" ")[1]
      }

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
          console.error(`Auth Error: ${err.message}`)
          console.error(err)
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
        return identity.doInUserContext(user, ctx, next)
      } else {
        return next()
      }
    } catch (err: any) {
      console.error(`Auth Error: ${err.message}`)
      console.error(err)
      // invalid token, clear the cookie
      if (err?.name === "JsonWebTokenError") {
        clearCookie(ctx, Cookie.Auth)
      } else if (err?.code === ErrorCode.INVALID_API_KEY) {
        ctx.throw(403, err.message)
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
