const send = require("koa-send")

module.exports = async (ctx, next) => {
  const path = ctx.path.replace(`/${ctx.params.appname}`, "")

  if (path.startsWith("/api/")) {
    await next()
  } else if (path.startsWith("/_shared/")) {
    await send(ctx, path.replace(`/_shared/`, ""), { root: ctx.sharedPath })
  } else if (
    path.endsWith(".js") ||
    path.endsWith(".map") ||
    path.endsWith(".css")
  ) {
    await send(ctx, path, { root: ctx.publicPath })
  } else {
    await send(ctx, "/index.html", { root: ctx.publicPath })
  }
}
