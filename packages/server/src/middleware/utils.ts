import { LoginMethod, UserCtx } from "@budibase/types"

const WEBHOOK_ENDPOINTS = new RegExp(
  [
    "webhooks/trigger",
    "webhooks/schema",
    "webhooks/discord",
    "webhooks/ms-teams",
  ].join("|")
)

/** Any /api/assets/:appId/ request (client script, chunks, etc.) – allow for microfrontend, do not redirect. */
const MICROFRONTEND_ASSET_PATH = /^\/api\/assets\/[^/]+\//

export function isClientLibraryRequest(ctx: UserCtx) {
  return MICROFRONTEND_ASSET_PATH.test(ctx.path)
}

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
