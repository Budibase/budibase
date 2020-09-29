exports.isEnabled = async function(ctx) {
  ctx.body = JSON.stringify(process.env.NODE_ENV === "production")
}
