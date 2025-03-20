import fetch, { RequestInit } from "node-fetch"
import { HttpError } from "koa"
import { get } from "../oauth2"
import { OAuth2CredentialsMethod } from "@budibase/types"

async function fetchToken(config: {
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
}) {
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
      grant_type: "client_credentials",
      client_id: config.clientId,
      client_secret: config.clientSecret,
    })
  }

  const resp = await fetch(config.url, fetchConfig)
  return resp
}

// TODO: check if caching is worth
export async function generateToken(id: string) {
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

  return `${jsonResponse.token_type} ${jsonResponse.access_token}`
}

export async function validateConfig(config: {
  url: string
  clientId: string
  clientSecret: string
  method: OAuth2CredentialsMethod
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
