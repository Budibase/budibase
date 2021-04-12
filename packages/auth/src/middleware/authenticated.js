const CouchDB = require("../db")
const { Cookies } = require("../constants")
const { getAppId, setCookie, getCookie } = require("../utils")
const { StaticDatabases } = require("../db/utils")

async function setCurrentAppContext(ctx) {
  let role = "PUBLIC"

  // Current app cookie
  let appId = getAppId(ctx)
  if (!appId) {
    ctx.user = {
      role,
    }
    return
  }

  console.log("THE APP ID", appId)

  const currentAppCookie = getCookie(ctx, Cookies.CurrentApp, { decrypt: true })
  const appIdChanged = appId && currentAppCookie.appId !== appId
  if (appIdChanged) {
    try {
      // get roles for user from global DB
      const db = new CouchDB(StaticDatabases.USER)
      const user = await db.get(ctx.user)
      role = user.roles[appId]
    } catch (err) {
      // no user exists
    }
  } else if (currentAppCookie.appId) {
    appId = currentAppCookie.appId
  }
  setCookie(ctx, { appId, role }, Cookies.CurrentApp, { encrypt: true })
  return appId
}

module.exports = async (ctx, next) => {
  try {
    // check the actual user is authenticated first
    const authCookie = getCookie(ctx, Cookies.Auth, { decrypt: true })

    if (authCookie) {
      ctx.isAuthenticated = true
      ctx.user = authCookie._id
    }

    ctx.appId = await setCurrentAppContext(ctx)

    console.log("CONTEXT", ctx)

    await next()
  } catch (err) {
    console.log(err)
    ctx.throw(err.status || 403, err.text)
  }
}
