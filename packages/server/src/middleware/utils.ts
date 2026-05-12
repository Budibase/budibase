import { LoginMethod, UserCtx } from "@budibase/types"

const WEBHOOK_ENDPOINTS = new RegExp(
  "^/api/webhooks/(trigger|discord|ms-teams|slack)(/|$)"
)

const WEBHOOK_SCHEMA_ENDPOINT = new RegExp(
  "^/api/webhooks/schema/[^/]+/[^/]+/[^/]+(/|$)"
)

const getPath = (ctx: UserCtx): string =>
  ctx.path || ctx.request.url.split("?")[0]

export function isWebhookEndpoint(ctx: UserCtx): boolean {
  return WEBHOOK_ENDPOINTS.test(getPath(ctx))
}

export function isPublicWebhookEndpoint(ctx: UserCtx): boolean {
  const path = getPath(ctx)
  return WEBHOOK_ENDPOINTS.test(path) || WEBHOOK_SCHEMA_ENDPOINT.test(path)
}

export function isBrowser(ctx: UserCtx): boolean {
  const browser = ctx.userAgent?.browser
  return !!browser && browser !== "unknown"
}

export function isApiKey(ctx: UserCtx): boolean {
  return ctx.loginMethod === LoginMethod.API_KEY
}
