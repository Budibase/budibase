import {
  cache,
  context,
  docIds,
  env,
  HTTPError,
  utils as coreUtils,
} from "@budibase/backend-core"
import {
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  RestAuthType,
  type Document,
} from "@budibase/types"
import { type RequestInit } from "node-fetch"
import { get } from "."
import { processEnvironmentVariable } from "../../utils"
import { getDelegatedOAuthCredential } from "../ai/knowledgeSources/sharepoint/credentials"

interface OAuth2LogDocument extends Document {
  lastUsage: number
}

interface OAuth2ClientCredentialsTokenRequestConfig {
  _id?: string
  type?: RestAuthType.OAUTH2
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
  grantType?: OAuth2GrantType
  scope?: string
  audience?: string
}

interface DelegatedOAuthTokenRequestConfig {
  _id: string
  type: RestAuthType.DELEGATED_OAUTH
  scope?: string
  audience?: string
}

type OAuth2TokenRequestConfig =
  | OAuth2ClientCredentialsTokenRequestConfig
  | DelegatedOAuthTokenRequestConfig

const { DocWritethrough } = cache.docWritethrough

async function fetchToken(config: OAuth2TokenRequestConfig) {
  config = await processEnvironmentVariable(config)
  if (config.type === RestAuthType.DELEGATED_OAUTH) {
    const tenantId = env.MICROSOFT_TENANT_ID || "common"
    const clientId = env.MICROSOFT_CLIENT_ID
    const clientSecret = env.MICROSOFT_CLIENT_SECRET
    if (!clientId || !clientSecret) {
      throw new Error("No Microsoft datasource configuration found")
    }
    if (!config._id) {
      throw new Error(
        "OAuth2 delegated config is missing connection context. Reconnect Microsoft account."
      )
    }
    const credential = await getDelegatedOAuthCredential(config._id)
    if (!credential?.refreshToken) {
      throw new Error(
        "OAuth2 delegated config is missing refresh token. Reconnect Microsoft account."
      )
    }
    const fetchConfig: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: credential.refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        ...(config.scope ? { scope: config.scope } : {}),
        ...(config.audience ? { audience: config.audience } : {}),
      }),
      redirect: "follow",
    }
    return fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      fetchConfig
    )
  }

  const fetchConfig: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: config.grantType || OAuth2GrantType.CLIENT_CREDENTIALS,
    }),
  }

  const bodyParams = new URLSearchParams({
    grant_type: config.grantType || OAuth2GrantType.CLIENT_CREDENTIALS,
  })
  if (config.method === OAuth2CredentialsMethod.HEADER) {
    fetchConfig.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${config.clientId}:${config.clientSecret}`,
        "utf-8"
      ).toString("base64")}`,
    }
  } else {
    bodyParams.set("client_id", config.clientId)
    bodyParams.set("client_secret", config.clientSecret)
  }

  if (config.scope) {
    bodyParams.set("scope", config.scope)
  }
  if (config.audience) {
    bodyParams.set("audience", config.audience)
  }

  fetchConfig.body = bodyParams
  const resp = await coreUtils.fetchWithBlacklist(config.url, fetchConfig)

  return resp
}

const trackUsage = async (id: string) => {
  const writethrough = new DocWritethrough<OAuth2LogDocument>(
    context.getWorkspaceDB(),
    docIds.generateOAuth2LogID(id)
  )
  await writethrough.patch({
    lastUsage: Date.now(),
  })
}

async function fetchAndParseToken(
  config: OAuth2TokenRequestConfig
): Promise<{ value: string; ttl: number }> {
  const resp = await fetchToken(config)
  const jsonResponse = await resp.json()
  if (!resp.ok) {
    const message = jsonResponse.error_description ?? resp.statusText
    throw new Error(`Error fetching oauth2 token: ${message}`)
  }
  const token = `${jsonResponse.token_type} ${jsonResponse.access_token}`
  const ttl = jsonResponse.expires_in ?? -1
  return { value: token, ttl }
}

export async function getToken(id: string) {
  const token = await cache.withCacheWithDynamicTTL(
    cache.CacheKey.OAUTH2_TOKEN(id),
    async () => {
      const config = await get(id)
      if (!config) {
        throw new HTTPError(`oAuth config ${id} could not be found`, 400)
      }
      return fetchAndParseToken(config)
    }
  )

  await trackUsage(id)
  return token
}

export async function getTokenFromConfig(
  config: OAuth2TokenRequestConfig
): Promise<string> {
  const resolvedCacheKey = config._id
  if (!resolvedCacheKey) {
    throw new Error("OAuth2 config is missing cache identity.")
  }
  return cache.withCacheWithDynamicTTL(
    cache.CacheKey.OAUTH2_TOKEN(resolvedCacheKey),
    () => fetchAndParseToken(config)
  )
}

export async function validateConfig(
  config: OAuth2TokenRequestConfig
): Promise<{ valid: boolean; message?: string }> {
  try {
    const resp = await fetchToken(config)
    const jsonResponse = await resp.json()
    if (!resp.ok) {
      const message = jsonResponse.error_description ?? resp.statusText
      return { valid: false, message }
    }
    return { valid: true }
  } catch (e: any) {
    return { valid: false, message: e.message }
  }
}

export async function getLastUsages(ids: string[]) {
  const devDocs = await context
    .getWorkspaceDB()
    .getMultiple<OAuth2LogDocument>(ids.map(docIds.generateOAuth2LogID), {
      allowMissing: true,
    })

  const prodDocs = await context
    .getProdWorkspaceDB()
    .getMultiple<OAuth2LogDocument>(ids.map(docIds.generateOAuth2LogID), {
      allowMissing: true,
    })

  const result = ids.reduce<Record<string, number>>((acc, id) => {
    const devDoc = devDocs.find(d => d._id === docIds.generateOAuth2LogID(id))
    if (devDoc) {
      acc[id] = devDoc.lastUsage
    }

    const prodDoc = prodDocs.find(d => d._id === docIds.generateOAuth2LogID(id))
    if (prodDoc && (!acc[id] || acc[id] < prodDoc.lastUsage)) {
      acc[id] = prodDoc.lastUsage
    }
    return acc
  }, {})
  return result
}

export async function cleanStoredToken(id: string) {
  await cache.destroy(cache.CacheKey.OAUTH2_TOKEN(id), { useTenancy: true })
}
