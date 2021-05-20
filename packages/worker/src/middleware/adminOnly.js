module.exports = async (ctx, next) => {
  if (!ctx.user || !ctx.user.admin || !ctx.user.admin.global) {
    ctx.throw(403, "Admin user only endpoint.")
  }
  return next()
}
