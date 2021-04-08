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

  let token
  if (appId) {
    token = ctx.cookies.get(Cookies.Auth)
  }

  if (!token) {
    ctx.auth = {
      authenticated: true,
    }
    ctx.appId = appId
    // ctx.user = {
    //   // TODO: introduce roles again
    //   // role: builtinRoles.PUBLIC,
    // }
    return await next()
  }

  return passport.authenticate("jwt", async (err, user) => {
    if (err) {
      return ctx.throw(err)
    }

    try {
      ctx.user = user
      await next()
    } catch (err) {
      console.log(err)
      ctx.throw(err.status || 403, err.text)
    }
  })(ctx, next)
}
