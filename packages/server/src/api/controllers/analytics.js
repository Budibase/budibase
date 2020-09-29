exports.isEnabled = async function(ctx) {
  ctx.body = JSON.stringify(process.env.ENABLE_ANALYTICS === "true")
}
