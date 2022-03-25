const { analytics } = require("@budibase/backend-core")

exports.isEnabled = async ctx => {
  ctx.body = {
    enabled: analytics.enabled(),
  }
}

exports.endUserPing = async ctx => {
  if (!analytics.enabled()) {
    ctx.body = {
      ping: false,
    }
    return
  }

  // posthogClient.identify({
  //   distinctId: ctx.user && ctx.user._id,
  //   properties: {},
  // })

  analytics.captureEvent(ctx.user._id, "budibase:end_user_ping", {
    appId: ctx.appId,
  })

  ctx.body = {
    ping: true,
  }
}
