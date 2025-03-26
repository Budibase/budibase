import fetch, { RequestInit } from "node-fetch"
import { HttpError } from "koa"
import { get } from "../oauth2"
import {
  Document,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
} from "@budibase/types"
import { cache, context, docIds } from "@budibase/backend-core"
import { processEnvironmentVariable } from "../../utils"

interface OAuth2LogDocument extends Document {
  lastUsage: number
}

const { DocWritethrough } = cache.docWritethrough

async function fetchToken(config: {
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
  grantType: OAuth2GrantType
}) {
  config = await processEnvironmentVariable(config)

  const fetchConfig: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    redirect: "follow",
  }

  if (config.method === OAuth2CredentialsMethod.HEADER) {
    fetchConfig.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${config.clientId}:${config.clientSecret}`,
        "utf-8"
      ).toString("base64")}`,
    }
  } else {
    fetchConfig.body = new URLSearchParams({
      grant_type: config.grantType,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    })
  }

  const resp = await fetch(config.url, fetchConfig)
  return resp
}

const trackUsage = async (id: string) => {
  const writethrough = new DocWritethrough<OAuth2LogDocument>(
    context.getAppDB(),
    docIds.generateOAuth2LogID(id)
  )
  await writethrough.patch({
    lastUsage: Date.now(),
  })
}

export async function getToken(id: string) {
  const token = await cache.withCacheWithDynamicTTL(
    cache.CacheKey.OAUTH2_TOKEN(id),
    async () => {
      const config = await get(id)
      if (!config) {
        throw new HttpError(`oAuth config ${id} count not be found`)
      }

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
  )

  await trackUsage(id)
  return token
}

export async function validateConfig(config: {
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
  grantType: OAuth2GrantType
}): Promise<{ valid: boolean; message?: string }> {
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
    .getAppDB()
    .getMultiple<OAuth2LogDocument>(ids.map(docIds.generateOAuth2LogID), {
      allowMissing: true,
    })

  const prodDocs = await context
    .getProdAppDB()
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
