const env = require("../../environment")
const PostHog = require("posthog-node")

let posthogClient

if (env.POSTHOG_TOKEN && env.ENABLE_ANALYTICS && !env.SELF_HOSTED) {
  posthogClient = new PostHog(env.POSTHOG_TOKEN)
}

exports.isEnabled = async ctx => {
  ctx.body = {
    enabled: !env.SELF_HOSTED && env.ENABLE_ANALYTICS === "true",
  }
}

exports.endUserPing = async ctx => {
  if (!posthogClient) {
    ctx.body = {
      ping: false,
    }
    return
  }

  posthogClient.identify({
    distinctId: ctx.user && ctx.user._id,
    properties: {},
  })
  posthogClient.capture({
    event: "budibase:end_user_ping",
    distinctId: ctx.user && ctx.user._id,
    properties: {
      appId: ctx.appId,
    },
  })

  ctx.body = {
    ping: true,
  }
}
