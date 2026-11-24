import { createHmac } from "crypto"
import type { KeyObject } from "crypto"

export const getSessionCookieKey = (secret?: KeyObject) => {
  if (!secret) {
    throw new Error("JWT_SECRET is required for worker session cookies")
  }

  return createHmac("sha256", secret)
    .update("budibase:worker:koa-session:v1")
    .digest("hex")
}
