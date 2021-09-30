const env = require("../../environment")
const PostHog = require("posthog-node")

let posthogClient

if (env.POSTHOG_TOKEN && env.ENABLE_ANALYTICS && !env.SELF_HOSTED) {
  posthogClient = new PostHog(env.POSTHOG_TOKEN)
}

exports.isEnabled = async function (ctx) {
  ctx.body = {
    enabled: !env.SELF_HOSTED && env.ENABLE_ANALYTICS === "true",
  }
}

exports.endUserPing = async (ctx, next) => {
  if (!posthogClient) return next()

  posthogClient.capture("budibase:end_user_ping", {
    userId: ctx.user && ctx.user._id,
    appId: ctx.appId,
  })

  ctx.body = {
    ping: true,
  }
}
