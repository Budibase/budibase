import { LoginMethod, UserCtx } from "@budibase/types"

const WEBHOOK_ENDPOINTS = new RegExp(
  "^/api/webhooks/(trigger|schema|discord|ms-teams|slack)(/|$)"
)

export function isWebhookEndpoint(ctx: UserCtx) {
  const path = ctx.path || ctx.request.url.split("?")[0]
  return WEBHOOK_ENDPOINTS.test(path)
}

export function isBrowser(ctx: UserCtx) {
  const browser = ctx.userAgent?.browser
  return browser && browser !== "unknown"
}

export function isApiKey(ctx: UserCtx) {
  return ctx.loginMethod === LoginMethod.API_KEY
}
