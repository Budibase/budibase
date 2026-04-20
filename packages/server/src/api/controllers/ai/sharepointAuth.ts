import {
  cache,
  configs,
  constants,
  context,
  env,
  utils,
} from "@budibase/backend-core"
import { DatasourceAuthCookie, UserCtx } from "@budibase/types"
import { getSharePointWorkspaceConnectionKey } from "../../../sdk/workspace/ai/rag/sharepoint"
import sdk from "../../../sdk"

const DEFAULT_SCOPE = env.RAG_SHAREPOINT_DEFAULT_SCOPE
const STATE_CACHE_TTL_SECONDS = 600
const MICROSOFT_PROVIDER = "microsoft"
const SHAREPOINT_SOURCE_TYPE = "sharepoint"

const getMicrosoftConfig = () => {
  if (!env.MICROSOFT_CLIENT_ID || !env.MICROSOFT_CLIENT_SECRET) {
    throw new Error("No Microsoft datasource configuration found")
  }
  return {
    clientId: env.MICROSOFT_CLIENT_ID,
    clientSecret: env.MICROSOFT_CLIENT_SECRET,
    tenantId: env.MICROSOFT_TENANT_ID || "common",
  }
}

const appendQueryParam = (path: string, key: string, value: string) => {
  const base = "http://localhost"
  const url = new URL(path, base)
  url.searchParams.set(key, value)
  const qs = url.searchParams.toString()
  return `${url.pathname}${qs ? `?${qs}` : ""}`
}

export async function startSharePointAuth(ctx: UserCtx<void, void>) {
  const appId = String(ctx.query.appId || "").trim()
  const returnPath =
    typeof ctx.query.returnPath === "string" ? ctx.query.returnPath : undefined

  if (!appId) {
    ctx.throw(400, "appId query param not present.")
  }
  console.log("Starting SharePoint OAuth flow", {
    appId,
    hasReturnPath: !!returnPath,
  })

  const { clientId, tenantId } = getMicrosoftConfig()
  const platformUrl = await configs.getPlatformUrl({ tenantAware: false })
  const callbackUrl = `${platformUrl}/api/agent/knowledge-sources/sharepoint/callback`

  const state = utils.newid()
  await cache.store(
    `datasource:${MICROSOFT_PROVIDER}:state:${state}`,
    {
      appId,
      provider: MICROSOFT_PROVIDER,
    },
    STATE_CACHE_TTL_SECONDS
  )

  utils.setCookie(
    ctx,
    {
      provider: MICROSOFT_PROVIDER,
      appId,
      returnPath,
    } satisfies DatasourceAuthCookie,
    constants.Cookie.DatasourceAuth
  )

  const authorizeUrl = new URL(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`
  )
  authorizeUrl.searchParams.set("client_id", clientId)
  authorizeUrl.searchParams.set("response_type", "code")
  authorizeUrl.searchParams.set("redirect_uri", callbackUrl)
  authorizeUrl.searchParams.set("response_mode", "query")
  authorizeUrl.searchParams.set("scope", DEFAULT_SCOPE)
  authorizeUrl.searchParams.set("state", state)

  ctx.redirect(authorizeUrl.toString())
}

export async function completeSharePointAuth(ctx: UserCtx<void, void>) {
  const authStateCookie = utils.getCookie<DatasourceAuthCookie>(
    ctx,
    constants.Cookie.DatasourceAuth
  )
  if (!authStateCookie) {
    throw new Error("Unable to fetch datasource auth cookie")
  }

  const appId = String(authStateCookie.appId || "").trim()
  if (!appId) {
    throw new Error("Missing app id from datasource auth cookie")
  }
  if (authStateCookie.provider !== MICROSOFT_PROVIDER) {
    throw new Error("Invalid datasource provider for Microsoft OAuth callback")
  }

  const state = String(ctx.query.state || "").trim()
  if (!state) {
    throw new Error("Microsoft OAuth callback is missing state")
  }
  const statePayload = (await cache.get(
    `datasource:${MICROSOFT_PROVIDER}:state:${state}`
  )) as { appId?: string; provider?: string }
  await cache.destroy(`datasource:${MICROSOFT_PROVIDER}:state:${state}`)
  const stateAppId =
    typeof statePayload?.appId === "string" ? statePayload.appId.trim() : ""
  if (
    !statePayload ||
    !stateAppId ||
    stateAppId !== appId ||
    statePayload.provider !== MICROSOFT_PROVIDER
  ) {
    throw new Error("Microsoft OAuth state is invalid or expired")
  }

  const oauthError = String(ctx.query.error || "").trim()
  if (oauthError) {
    const description = String(ctx.query.error_description || "").trim()
    console.error("Microsoft OAuth authorization failed", {
      appId,
      error: oauthError,
      hasDescription: !!description,
    })
    throw new Error("Microsoft OAuth authorization failed")
  }

  const code = String(ctx.query.code || "").trim()
  if (!code) {
    throw new Error(
      "Microsoft OAuth callback is missing the authorization code"
    )
  }

  const { clientId, clientSecret, tenantId } = getMicrosoftConfig()
  const platformUrl = await configs.getPlatformUrl({ tenantAware: false })
  const callbackUrl = `${platformUrl}/api/agent/knowledge-sources/sharepoint/callback`
  const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

  const tokenResponse = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: callbackUrl,
      scope: DEFAULT_SCOPE,
    }),
  })
  const tokenPayload = await tokenResponse.json()
  if (!tokenResponse.ok) {
    console.error("Microsoft OAuth token exchange failed", {
      appId,
      status: tokenResponse.status,
      error: tokenPayload?.error,
      hasDescription: !!tokenPayload?.error_description,
    })
    throw new Error("Failed to exchange Microsoft OAuth code")
  }

  const refreshToken = tokenPayload?.refresh_token
  const accessToken = tokenPayload?.access_token
  if (!refreshToken) {
    throw new Error("Microsoft OAuth response did not include a refresh token")
  }
  if (!accessToken) {
    throw new Error("Microsoft OAuth response did not include an access token")
  }

  const expiresIn = Number(tokenPayload?.expires_in || 0)

  await context.doInContext(appId, () =>
    sdk.ai.knowledgeSources.upsertKnowledgeSourceConnection(
      SHAREPOINT_SOURCE_TYPE,
      getSharePointWorkspaceConnectionKey(appId),
      {
        tenantId,
        tokenEndpoint,
        accessToken,
        refreshToken,
        tokenType: tokenPayload?.token_type || "Bearer",
        expiresAt: Date.now() + Math.max((expiresIn || 0) - 60, 0) * 1000,
        clientId,
        clientSecret,
      }
    )
  )
  console.log("Completed SharePoint OAuth flow", {
    appId,
    connected: true,
  })

  utils.clearCookie(ctx, constants.Cookie.DatasourceAuth)

  const returnPath = authStateCookie.returnPath || `/builder/workspace/${appId}`
  ctx.redirect(appendQueryParam(returnPath, "microsoft_connected", "1"))
}
