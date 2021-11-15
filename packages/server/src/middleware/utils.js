const WEBHOOK_ENDPOINTS = new RegExp(
  ["webhooks/trigger", "webhooks/schema"].join("|")
)

exports.isWebhookEndpoint = ctx => {
  return WEBHOOK_ENDPOINTS.test(ctx.request.url)
}
