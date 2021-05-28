module.exports = async (ctx, next) => {
  ctx.log.info({
    userId: ctx.user && ctx.user._id,
    ip: ctx.ip,
    url: ctx.originalUrl,
    origin: ctx.origin,
    method: ctx.method,
  })
  return next()
}
