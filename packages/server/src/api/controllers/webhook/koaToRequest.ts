import type { IncomingMessage } from "http"
import type { Ctx } from "@budibase/types"

type WebhookCtx<
  Params extends Record<string, unknown> = Record<string, unknown>,
> = Ctx<unknown, unknown, Params>

export const readRawBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    let totalBytes = 0

    req.on("data", (chunk: Buffer | string) => {
      const bytes =
        typeof chunk === "string"
          ? new Uint8Array(Buffer.from(chunk, "utf8"))
          : new Uint8Array(chunk)
      chunks.push(bytes)
      totalBytes += bytes.byteLength
    })

    req.on("end", () => {
      if (totalBytes === 0) {
        resolve("")
        return
      }

      const allBytes = new Uint8Array(totalBytes)
      let offset = 0
      for (const chunk of chunks) {
        allBytes.set(chunk, offset)
        offset += chunk.byteLength
      }
      resolve(Buffer.from(allBytes).toString("utf8"))
    })
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

export const rawBodyToRequest = (ctx: WebhookCtx, rawBody: string): Request => {
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
