import { LoginMethod, UserCtx } from "@budibase/types"

const WEBHOOK_ENDPOINTS = new RegExp(
  ["webhooks/trigger", "webhooks/schema"].join("|")
)

export function isWebhookEndpoint(ctx: UserCtx) {
  return WEBHOOK_ENDPOINTS.test(ctx.request.url)
}

export function isBrowser(ctx: UserCtx) {
  const browser = ctx.userAgent?.browser
  return browser && browser !== "unknown"
}

export function isApiKey(ctx: UserCtx) {
  return ctx.loginMethod === LoginMethod.API_KEY
}
