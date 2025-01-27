import { Cookie, Header } from "../constants"
import {
  clearCookie,
  getCookie,
  isValidInternalAPIKey,
  openJwt,
} from "../utils"
import { getUser } from "../cache/user"
import { getSession, updateSessionTTL } from "../security/sessions"
import { buildMatcherRegex, matches } from "./matchers"
import { queryGlobalView, SEPARATOR, ViewName } from "../db"
import { doInTenant, getGlobalDB } from "../context"
import { decrypt } from "../security/encryption"
import * as identity from "../context/identity"
import env from "../environment"
import {
  Ctx,
  EndpointMatcher,
  LoginMethod,
  SessionCookie,
  User,
} from "@budibase/types"
import { ErrorCode, InvalidAPIKeyError } from "../errors"
import tracer from "dd-trace"
import type { Middleware, Next } from "koa"

const ONE_MINUTE = env.SESSION_UPDATE_PERIOD
  ? parseInt(env.SESSION_UPDATE_PERIOD)
  : 60 * 1000

interface FinaliseOpts {
  authenticated?: boolean
  internal?: boolean
  publicEndpoint?: boolean
  version?: string
  user?: User | { tenantId: string }
  loginMethod?: LoginMethod
}

function timeMinusOneMinute() {
  return new Date(Date.now() - ONE_MINUTE).toISOString()
}

function finalise(ctx: Ctx, opts: FinaliseOpts = {}) {
  ctx.publicEndpoint = opts.publicEndpoint || false
  ctx.isAuthenticated = opts.authenticated || false
  ctx.loginMethod = opts.loginMethod
  ctx.user = opts.user
  ctx.internal = opts.internal || false
  ctx.version = opts.version
}

async function checkApiKey(
  apiKey: string,
  populateUser?: (
    userId: string,
    tenantId: string,
    email?: string
  ) => Promise<User>
) {
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
        user: await getUser({
          userId,
          tenantId,
          populateUser,
        }),
      }
    } else {
      throw new InvalidAPIKeyError()
    }
  })
}

function getHeader(ctx: Ctx, header: Header): string | undefined {
  const contents = ctx.request.headers[header]
  if (Array.isArray(contents)) {
    throw new Error("Unexpected header format")
  }
  return contents
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
  return (async (ctx: Ctx, next: Next) => {
    let publicEndpoint = false
    const version = getHeader(ctx, Header.API_VER)
    // the path is not authenticated
    const found = matches(ctx, noAuthOptions)
    if (found) {
      publicEndpoint = true
    }
    try {
      // check the actual user is authenticated first, try header or cookie
      let headerToken = getHeader(ctx, Header.TOKEN)

      const authCookie =
        getCookie<SessionCookie>(ctx, Cookie.Auth) ||
        openJwt<SessionCookie>(headerToken)
      let apiKey = getHeader(ctx, Header.API_KEY)

      if (!apiKey && ctx.request.headers[Header.AUTHORIZATION]) {
        apiKey = ctx.request.headers[Header.AUTHORIZATION].split(" ")[1]
      }

      const tenantId = getHeader(ctx, Header.TENANT_ID)
      let authenticated = false,
        user: User | { tenantId: string } | undefined = undefined,
        internal = false,
        loginMethod: LoginMethod | undefined = undefined
      if (authCookie && !apiKey) {
        const sessionId = authCookie.sessionId
        const userId = authCookie.userId
        let session
        try {
          // getting session handles error checking (if session exists etc)
          session = await getSession(userId, sessionId)
          if (opts && opts.populateUser) {
            user = await getUser({
              userId,
              tenantId: session.tenantId,
              email: session.email,
              populateUser: opts.populateUser(ctx),
            })
          } else {
            user = await getUser({
              userId,
              tenantId: session.tenantId,
              email: session.email,
            })
          }
          // @ts-ignore
          user.csrfToken = session.csrfToken
          loginMethod = LoginMethod.COOKIE

          if (session?.lastAccessedAt < timeMinusOneMinute()) {
            // make sure we denote that the session is still in use
            await updateSessionTTL(session)
          }
          authenticated = true
        } catch (err: any) {
          authenticated = false
          console.error(`Auth Error: ${err.message}`)
          // remove the cookie as the user does not exist anymore
          clearCookie(ctx, Cookie.Auth)
        }
      }
      // this is an internal request, no user made it
      if (!authenticated && apiKey) {
        const populateUser: (
          userId: string,
          tenantId: string,
          email?: string
        ) => Promise<User> = opts.populateUser ? opts.populateUser(ctx) : null
        const { valid, user: foundUser } = await checkApiKey(
          apiKey,
          populateUser
        )
        if (valid) {
          authenticated = true
          loginMethod = LoginMethod.API_KEY
          user = foundUser
          internal = !foundUser
        }
      }
      if (!user && tenantId) {
        user = { tenantId }
      } else if (user && "password" in user) {
        delete user.password
      }
      // be explicit
      if (!authenticated) {
        authenticated = false
      }

      const isUser = (
        user: any
      ): user is User & { budibaseAccess?: string } => {
        return user && user.email
      }

      if (isUser(user)) {
        tracer.setUser({
          id: user._id!,
          tenantId: user.tenantId,
          budibaseAccess: user.budibaseAccess,
          status: user.status,
        })
      }

      // isAuthenticated is a function, so use a variable to be able to check authed state
      finalise(ctx, {
        authenticated,
        user,
        internal,
        version,
        publicEndpoint,
        loginMethod,
      })

      if (isUser(user)) {
        return identity.doInUserContext(user, ctx, next)
      } else {
        return next()
      }
    } catch (err: any) {
      console.error(`Auth Error: ${err.message}`)
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
  }) as Middleware
}
