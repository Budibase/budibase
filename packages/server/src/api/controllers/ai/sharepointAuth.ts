import {
  cache,
  configs,
  constants,
  context,
  encryption,
  env,
  utils,
} from "@budibase/backend-core"
import {
  Datasource,
  DatasourceAuthCookie,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  OAuth2RestAuthConfig,
  RestAuthType,
  SourceName,
  UserCtx,
  isOAuth2DelegatedAuthConfig,
} from "@budibase/types"
import sdk from "../../../sdk"
import { saveSharePointCredential } from "../../../sdk/workspace/ai/knowledgeSources/sharepoint/credentials"

const DEFAULT_SCOPE = env.RAG_SHAREPOINT_DEFAULT_SCOPE
const STATE_CACHE_TTL_SECONDS = 600
const MICROSOFT_PROVIDER = "microsoft"
const MICROSOFT_GRAPH_BASE = "https://graph.microsoft.com/v1.0"
const TOKEN_EXPIRY_BUFFER_SECONDS = 60

export const calculateBufferedTokenExpiry = (expiresInSeconds: number) => {
  const bufferedTtlSeconds = Math.max(
    expiresInSeconds - TOKEN_EXPIRY_BUFFER_SECONDS,
    0
  )
  return Date.now() + bufferedTtlSeconds * 1000
}

interface SharePointOAuthState {
  appId?: string
  provider?: string
  datasourceId?: string
  authConfigId?: string
}

interface DelegatedSharePointCredentials {
  account: string
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresAt: number
  tokenEndpoint: string
  clientId: string
  clientSecret: string
}

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
  const datasourceId = String(ctx.query.datasourceId || "").trim()
  const authConfigId = String(ctx.query.authConfigId || "").trim()
  const returnPath =
    typeof ctx.query.returnPath === "string" ? ctx.query.returnPath : undefined

  if (!appId) {
    ctx.throw(400, "appId query param not present.")
  }
  if (!datasourceId) {
    ctx.throw(400, "datasourceId query param not present.")
  }
  console.log("Starting SharePoint OAuth flow", {
    appId,
    datasourceId,
    hasAuthConfigId: !!authConfigId,
    hasReturnPath: !!returnPath,
  })

  const { clientId, tenantId } = getMicrosoftConfig()
  const platformUrl = await configs.getPlatformUrl({ tenantAware: false })
  const callbackUrl = `${platformUrl}/api/datasource/sharepoint/callback`

  const state = utils.newid()
  await cache.store(
    `datasource:${MICROSOFT_PROVIDER}:state:${state}`,
    {
      appId,
      datasourceId,
      authConfigId,
      provider: MICROSOFT_PROVIDER,
    } satisfies SharePointOAuthState,
    STATE_CACHE_TTL_SECONDS
  )

  utils.setCookie(
    ctx,
    {
      provider: MICROSOFT_PROVIDER,
      appId,
      returnPath,
      datasourceId,
      authConfigId,
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
  authorizeUrl.searchParams.set("prompt", "select_account")
  authorizeUrl.searchParams.set("state", state)

  ctx.redirect(authorizeUrl.toString())
}

const isSharePointDatasource = (datasource: Datasource) => {
  return (
    datasource.source === SourceName.REST &&
    (datasource.restTemplateId === "microsoft-sharepoint" ||
      datasource.restTemplate === "Microsoft SharePoint")
  )
}

export const upsertDelegatedSharePointAuthConfig = async (
  appId: string,
  datasourceId: string,
  authConfigId: string | undefined,
  credentials: DelegatedSharePointCredentials
) => {
  return context.doInWorkspaceContext(appId, async () => {
    const account = credentials.account.trim() || "unknown"
    for (let attempt = 0; attempt < 3; attempt++) {
      const datasource = await sdk.datasources.get(datasourceId)
      if (!isSharePointDatasource(datasource)) {
        throw new Error(
          "SharePoint OAuth can only be used with SharePoint datasources"
        )
      }

      const authConfigs = (
        (datasource.config?.authConfigs || []) as OAuth2RestAuthConfig[]
      ).filter(Boolean)
      const matchingConfig =
        (authConfigId
          ? authConfigs.find(config => config._id === authConfigId)
          : undefined) ||
        authConfigs.find(
          config =>
            isOAuth2DelegatedAuthConfig(config) &&
            config.account?.toLowerCase() === account.toLowerCase()
        )
      const nextAuthConfig: OAuth2RestAuthConfig = {
        ...(matchingConfig || {}),
        _id: matchingConfig?._id || `auth_${utils.newid()}`,
        type: RestAuthType.OAUTH2,
        authType: "delegated_oauth",
        name: matchingConfig?.name || `Microsoft SharePoint (${account})`,
        account,
        url: credentials.tokenEndpoint,
        clientId: credentials.clientId,
        clientSecret: encryption.encrypt(credentials.clientSecret),
        method: OAuth2CredentialsMethod.BODY,
        grantType: OAuth2GrantType.AUTHORIZATION_CODE,
        scope: DEFAULT_SCOPE,
      }
      const nextAuthConfigs = matchingConfig
        ? authConfigs.map(config =>
            config._id === matchingConfig._id ? nextAuthConfig : config
          )
        : [...authConfigs, nextAuthConfig]

      try {
        await sdk.datasources.save({
          ...datasource,
          config: {
            ...datasource.config,
            authConfigs: nextAuthConfigs,
          },
        })
      } catch (error: any) {
        if (
          (error?.status === 409 || error?.statusCode === 409) &&
          attempt < 2
        ) {
          continue
        }
        throw error
      }

      await saveSharePointCredential({
        datasourceId,
        authConfigId: nextAuthConfig._id,
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        tokenType: credentials.tokenType,
        expiresAt: credentials.expiresAt,
      })

      return {
        authConfigId: nextAuthConfig._id,
        reusedExistingConnection: !!matchingConfig,
      }
    }

    throw new Error("Failed to save SharePoint OAuth config due to conflicts")
  })
}

export async function completeSharePointAuth(ctx: UserCtx<void, void>) {
  const authStateCookie = utils.getCookie<DatasourceAuthCookie>(
    ctx,
    constants.Cookie.DatasourceAuth
  )

  const state = String(ctx.query.state || "").trim()
  if (!state) {
    throw new Error("Microsoft OAuth callback is missing state")
  }
  const statePayload = (await cache.get(
    `datasource:${MICROSOFT_PROVIDER}:state:${state}`
  )) as SharePointOAuthState
  await cache.destroy(`datasource:${MICROSOFT_PROVIDER}:state:${state}`)
  const stateAppId =
    typeof statePayload?.appId === "string" ? statePayload.appId.trim() : ""
  if (
    !statePayload ||
    !stateAppId ||
    statePayload.provider !== MICROSOFT_PROVIDER ||
    !statePayload.datasourceId
  ) {
    throw new Error("Microsoft OAuth state is invalid or expired")
  }
  const appId = stateAppId

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
  const callbackUrl = `${platformUrl}/api/datasource/sharepoint/callback`
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
  const tokenType = tokenPayload?.token_type || "Bearer"
  const bearerToken = `${tokenType} ${accessToken}`
  let account = "unknown"

  try {
    const meResponse = await fetch(
      `${MICROSOFT_GRAPH_BASE}/me?$select=displayName,mail,userPrincipalName`,
      {
        headers: {
          Authorization: bearerToken,
        },
      }
    )
    if (meResponse.ok) {
      const mePayload = await meResponse.json()
      const mail =
        typeof mePayload?.mail === "string" ? mePayload.mail.trim() : ""
      const upn =
        typeof mePayload?.userPrincipalName === "string"
          ? mePayload.userPrincipalName.trim()
          : ""
      account = mail || upn || "unknown"
    } else {
      console.log("Unable to fetch Microsoft account profile after OAuth", {
        appId,
        status: meResponse.status,
      })
    }
  } catch (error) {
    console.log("Unable to fetch Microsoft account profile after OAuth", {
      appId,
      error,
    })
  }
  const { reusedExistingConnection, authConfigId } =
    await upsertDelegatedSharePointAuthConfig(
      appId,
      statePayload.datasourceId!,
      statePayload.authConfigId,
      {
        account,
        accessToken,
        refreshToken,
        tokenType,
        tokenEndpoint,
        clientId,
        clientSecret,
        expiresAt: calculateBufferedTokenExpiry(expiresIn),
      }
    )
  console.log("SharePoint delegated OAuth callback received", {
    appId,
    datasourceId: statePayload.datasourceId,
    authConfigId,
    account,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    tokenEndpoint,
  })
  console.log("Completed SharePoint OAuth flow", {
    appId,
    connected: true,
  })

  utils.clearCookie(ctx, constants.Cookie.DatasourceAuth)

  const returnPath =
    authStateCookie?.returnPath || `/builder/workspace/${appId}`
  const withConnected = appendQueryParam(returnPath, "microsoft_connected", "1")
  const finalPath = reusedExistingConnection
    ? appendQueryParam(withConnected, "microsoft_connection_reused", "1")
    : withConnected
  ctx.redirect(finalPath)
}
