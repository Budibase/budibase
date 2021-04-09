const { passport, getAppId, setCookie, Cookies } = require("@budibase/auth")

module.exports = async (ctx, next) => {
  // do everything we can to make sure the appId is held correctly
  let appId = getAppId(ctx)
  const cookieAppId = ctx.cookies.get(Cookies.CurrentApp)
  // const builtinRoles = getBuiltinRoles()
  if (appId && cookieAppId !== appId) {
    setCookie(ctx, appId, Cookies.CurrentApp)
  } else if (cookieAppId) {
    appId = cookieAppId
  }

  return next()

  // return passport.authenticate("jwt", async (err, user) => {
  //   if (err) {
  //     return ctx.throw(err.status || 403, err)
  //   }
  //
  //   try {
  //     ctx.appId = appId
  //     ctx.isAuthenticated = true
  //     // TODO: introduce roles again
  //     ctx.user = user
  //     await next()
  //   } catch (err) {
  //     console.log(err)
  //     ctx.throw(err.status || 403, err.text)
  //   }
  // })(ctx, next)
}
