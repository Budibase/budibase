import type { IncomingMessage } from "http"
import type { Ctx } from "@budibase/types"

type WebhookCtx<
  Params extends Record<string, unknown> = Record<string, unknown>,
> = Ctx<unknown, unknown, Params>

export const readRawBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on("data", (chunk: Buffer) => chunks.push(chunk))
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })

export const tryParseJson = (rawBody: string): unknown => {
  if (!rawBody.trim()) {
    return undefined
  }
  try {
    return JSON.parse(rawBody) as unknown
  } catch {
    return undefined
  }
}

export const rawBodyToRequest = (
  ctx: WebhookCtx,
  rawBody: string
): Request => {
  const protocol = ctx.protocol || "http"
  const host = ctx.host || "localhost"
  const url = `${protocol}://${host}${ctx.originalUrl || ctx.url}`

  const headers = new Headers()
  for (const [key, value] of Object.entries(ctx.headers)) {
    if (typeof value === "string") {
      headers.set(key, value)
    } else if (Array.isArray(value)) {
      for (const v of value) {
        headers.append(key, v)
      }
    }
  }

  return new Request(url, {
    method: ctx.method,
    headers,
    body: rawBody,
  })
}

export const responseToKoa = async (
  ctx: WebhookCtx,
  response: Response
): Promise<void> => {
  ctx.status = response.status

  response.headers.forEach((value, key) => {
    ctx.set(key, value)
  })

  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    ctx.body = await response.json()
  } else {
    const text = await response.text()
    ctx.body = text || undefined
  }
}
