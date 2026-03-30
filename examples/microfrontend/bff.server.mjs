import "dotenv/config"
import crypto from "node:crypto"
import cookieParser from "cookie-parser"
import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import * as oidcClient from "openid-client"

const HOST_PORT = Number(process.env.HOST_PORT || 5173)
const BFF_PORT = Number(process.env.BFF_PORT || 5174)
const BUDIBASE_PORT = Number(process.env.BUDIBASE_PORT || 10000)
const HOST_ORIGIN = process.env.HOST_ORIGIN || `http://localhost:${HOST_PORT}`
const BUDIBASE_ORIGIN =
  process.env.BUDIBASE_ORIGIN || `http://localhost:${BUDIBASE_PORT}`
const BFF_PUBLIC_ORIGIN =
  process.env.BFF_PUBLIC_ORIGIN || `http://localhost:${BFF_PORT}`

const OIDC_ISSUER = process.env.OIDC_ISSUER
const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID
const OIDC_CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET
const OIDC_SCOPES = process.env.OIDC_SCOPES || "openid profile email"
const OIDC_REDIRECT_URI =
  process.env.OIDC_REDIRECT_URI || `${BFF_PUBLIC_ORIGIN}/auth/callback`
const BUDIBASE_TENANT_ID = process.env.BUDIBASE_TENANT_ID || "default"
const BUDIBASE_OIDC_CONFIG_ID = process.env.BUDIBASE_OIDC_CONFIG_ID

const COOKIE_NAME = "mf_sid"
const RETURN_TO_COOKIE = "mf_return_to"
const SESSION_TTL_MS = Number(
  process.env.BFF_SESSION_TTL_MS || 8 * 60 * 60 * 1000
)

const app = express()
app.use(cookieParser())
app.set("trust proxy", true)

const sessions = new Map()
const pendingLogins = new Map()
let oidcConfiguration

const hasOidcConfig = () =>
  Boolean(OIDC_ISSUER && OIDC_CLIENT_ID && OIDC_CLIENT_SECRET)

const requireOidcConfig = res => {
  if (hasOidcConfig()) {
    return true
  }
  res.status(500).json({
    message:
      "OIDC is not configured. Set OIDC_ISSUER, OIDC_CLIENT_ID and OIDC_CLIENT_SECRET.",
  })
  return false
}

const getOidcConfiguration = async () => {
  if (oidcConfiguration) {
    return oidcConfiguration
  }
  oidcConfiguration = await oidcClient.discovery(
    new URL(OIDC_ISSUER),
    OIDC_CLIENT_ID,
    OIDC_CLIENT_SECRET
  )
  return oidcConfiguration
}

const getSession = req => {
  const sid = req.cookies?.[COOKIE_NAME]
  if (!sid) {
    return null
  }
  const session = sessions.get(sid)
  if (!session) {
    return null
  }
  if (session.expiresAt < Date.now()) {
    sessions.delete(sid)
    return null
  }
  return { sid, ...session }
}

const setSessionCookie = (res, sid) => {
  res.cookie(COOKIE_NAME, sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS,
  })
}

const clearSessionCookie = res => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}

const setReturnToCookie = (res, returnTo) => {
  res.cookie(RETURN_TO_COOKIE, returnTo, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60 * 1000,
  })
}

const clearReturnToCookie = res => {
  res.clearCookie(RETURN_TO_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}

const sanitizeReturnTo = value => {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "/"
  }
  if (value.startsWith("//")) {
    return "/"
  }
  if (value.startsWith("/auth/")) {
    return "/"
  }
  return value
}

const sanitizeTenantId = value => {
  if (typeof value !== "string") {
    return BUDIBASE_TENANT_ID
  }
  const tenantId = value.trim()
  if (!tenantId) {
    return BUDIBASE_TENANT_ID
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(tenantId)) {
    return undefined
  }
  return tenantId
}

const rewriteBudibaseAuthLocation = (location, req) => {
  if (typeof location !== "string" || !location) {
    return location
  }

  const bffOrigin = `${req.protocol}://${req.get("host")}`

  try {
    const parsed = new URL(location, bffOrigin)
    if (parsed.pathname.startsWith("/builder")) {
      return `${bffOrigin}/`
    }

    return location
  } catch (_error) {
    if (location.startsWith("/builder")) {
      return `${bffOrigin}/`
    }
    return location
  }
}

const resolveBudibaseOidcConfigId = async tenantId => {
  if (BUDIBASE_OIDC_CONFIG_ID) {
    return BUDIBASE_OIDC_CONFIG_ID
  }
  const response = await fetch(
    `${BUDIBASE_ORIGIN}/api/global/configs/public/oidc?tenantId=${encodeURIComponent(tenantId)}`
  )
  if (!response.ok) {
    throw new Error(
      `Failed to fetch Budibase public OIDC config: ${response.status}`
    )
  }
  const configs = await response.json()
  const first = Array.isArray(configs) ? configs[0] : null
  if (!first?.uuid) {
    throw new Error("No Budibase OIDC config found for tenant")
  }
  return first.uuid
}

app.get("/auth/session", (req, res) => {
  const session = getSession(req)
  if (!session) {
    res.status(401).json({ authenticated: false })
    return
  }
  res.json({
    authenticated: true,
    expiresAt: session.expiresAt,
    user: session.user || null,
  })
})

app.get("/auth/login", async (req, res) => {
  try {
    if (!requireOidcConfig(res)) {
      return
    }

    const config = await getOidcConfiguration()
    const state = oidcClient.randomState()
    const nonce = oidcClient.randomNonce()
    const codeVerifier = oidcClient.randomPKCECodeVerifier()
    const codeChallenge =
      await oidcClient.calculatePKCECodeChallenge(codeVerifier)
    const returnTo = sanitizeReturnTo(req.query.returnTo)
    const bridgeBudibase = req.query.bridgeBudibase === "1"
    const tenantId = sanitizeTenantId(req.query.tenantId)
    if (!tenantId) {
      res.status(400).send("Invalid tenantId")
      return
    }

    pendingLogins.set(state, {
      nonce,
      codeVerifier,
      returnTo,
      bridgeBudibase,
      tenantId,
      createdAt: Date.now(),
    })

    const authUrl = oidcClient.buildAuthorizationUrl(config, {
      redirect_uri: OIDC_REDIRECT_URI,
      scope: OIDC_SCOPES,
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    })

    res.redirect(authUrl.toString())
  } catch (error) {
    console.error("OIDC login start failed", error)
    res.status(500).send("Failed to start OIDC login flow")
  }
})

app.get("/auth/callback", async (req, res) => {
  try {
    if (!requireOidcConfig(res)) {
      return
    }

    const { state } = req.query
    if (!state || typeof state !== "string") {
      res.status(400).send("Invalid OIDC callback parameters")
      return
    }

    const loginContext = pendingLogins.get(state)
    pendingLogins.delete(state)
    if (!loginContext) {
      res.status(400).send("Invalid or expired login state")
      return
    }

    const config = await getOidcConfiguration()
    const currentUrl = new URL(
      `${req.protocol}://${req.get("host")}${req.originalUrl}`
    )
    const tokenSet = await oidcClient.authorizationCodeGrant(
      config,
      currentUrl,
      {
        pkceCodeVerifier: loginContext.codeVerifier,
        expectedState: state,
        expectedNonce: loginContext.nonce,
        idTokenExpected: true,
      }
    )

    const claims = tokenSet.claims?.() || null
    let user = claims
    if (tokenSet.access_token) {
      try {
        user = await oidcClient.fetchUserInfo(
          config,
          tokenSet.access_token,
          claims?.sub
        )
      } catch (_userinfoError) {
        console.warn(
          "OIDC userinfo fetch failed, falling back to ID token claims"
        )
      }
    }

    const sid = crypto.randomUUID()
    sessions.set(sid, {
      user,
      tokenSet,
      expiresAt: Date.now() + SESSION_TTL_MS,
    })
    setSessionCookie(res, sid)
    if (loginContext.bridgeBudibase) {
      const configId = await resolveBudibaseOidcConfigId(loginContext.tenantId)
      setReturnToCookie(res, loginContext.returnTo)
      const encodedTenantId = encodeURIComponent(loginContext.tenantId)
      res.redirect(
        `/api/global/auth/${encodedTenantId}/oidc/configs/${configId}`
      )
      return
    }
    res.redirect(loginContext.returnTo)
  } catch (error) {
    console.error("OIDC callback handling failed", error)
    res.status(401).send("OIDC callback failed")
  }
})

app.get("/auth/logout", async (req, res) => {
  const returnTo = sanitizeReturnTo(req.query.returnTo)
  const session = getSession(req)

  // Always clear local BFF session.
  if (session?.sid) {
    sessions.delete(session.sid)
  }
  clearSessionCookie(res)

  // Best effort: clear Budibase auth cookie as part of sign-out.
  try {
    await fetch(`${BUDIBASE_ORIGIN}/api/global/auth/logout`, {
      method: "POST",
      headers: {
        cookie: req.headers.cookie || "",
      },
    })
  } catch (_error) {
    // ignore, we still continue with local/IdP logout
  }

  // If we cannot do OIDC RP-initiated logout, still return to the app route.
  if (!session?.tokenSet?.id_token || !hasOidcConfig()) {
    res.redirect(returnTo)
    return
  }

  try {
    const config = await getOidcConfiguration()
    setReturnToCookie(res, returnTo)
    const postLogoutRedirectUri = `${req.protocol}://${req.get("host")}/auth/logout/callback`
    const endSessionUrl = oidcClient.buildEndSessionUrl(config, {
      id_token_hint: session.tokenSet.id_token,
      post_logout_redirect_uri: postLogoutRedirectUri,
    })
    res.redirect(endSessionUrl.toString())
  } catch (_error) {
    res.redirect(returnTo)
  }
})

app.get("/auth/logout/callback", (req, res) => {
  const returnTo = req.cookies?.[RETURN_TO_COOKIE]
  clearReturnToCookie(res)
  res.redirect(sanitizeReturnTo(returnTo))
})

setInterval(() => {
  const now = Date.now()
  for (const [sid, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(sid)
    }
  }
  for (const [state, login] of pendingLogins.entries()) {
    if (login.createdAt + 10 * 60 * 1000 < now) {
      pendingLogins.delete(state)
    }
  }
}, 60 * 1000).unref()

const budibaseTarget = BUDIBASE_ORIGIN

app.use(
  "/api/global/auth",
  createProxyMiddleware({
    target: budibaseTarget,
    changeOrigin: false,
    pathRewrite: path => `/api/global/auth${path}`,
    on: {
      proxyRes: (proxyRes, req) => {
        const location = proxyRes.headers?.location
        if (!location) {
          return
        }
        proxyRes.headers.location = rewriteBudibaseAuthLocation(location, req)
      },
    },
  })
)

app.get("/", (req, res, next) => {
  const returnTo = req.cookies?.[RETURN_TO_COOKIE]
  if (typeof returnTo === "string" && returnTo.startsWith("/")) {
    clearReturnToCookie(res)
    res.redirect(sanitizeReturnTo(returnTo))
    return
  }
  next()
})

app.use(
  "/",
  createProxyMiddleware({
    target: HOST_ORIGIN,
    changeOrigin: true,
    ws: true,
  })
)

app.listen(BFF_PORT, () => {
  console.log(`BFF listening on ${BFF_PUBLIC_ORIGIN}`)
  console.log(`Host shell target: ${HOST_ORIGIN}`)
  console.log(`Budibase auth target: ${budibaseTarget}`)
  console.log("Budibase routing: via host Vite proxy")
})
