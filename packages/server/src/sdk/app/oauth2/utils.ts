import fetch from "node-fetch"
import { HttpError } from "koa"
import { get } from "../oauth2"

export async function generateToken(id: string) {
  const config = await get(id)
  if (!config) {
    throw new HttpError(`oAuth config ${id} count not be found`)
  }

  const resp = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
    redirect: "follow",
  })
  if (resp.status !== 200) {
    throw new Error(`Error fetching oauth2 token: ${resp.statusText}`)
  }
  const jsonResponse = await resp.json()
  return `${jsonResponse.token_type} ${jsonResponse.access_token}`
}
