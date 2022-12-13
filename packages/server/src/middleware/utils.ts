import { BBContext } from "@budibase/types"

const WEBHOOK_ENDPOINTS = new RegExp(
  ["webhooks/trigger", "webhooks/schema"].join("|")
)

export function isWebhookEndpoint(ctx: BBContext) {
  return WEBHOOK_ENDPOINTS.test(ctx.request.url)
}
