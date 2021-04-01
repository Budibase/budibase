const env = require("../environment")
const { DocumentTypes, SEPARATOR } = require("../db/utils")
const CouchDB = require("../db")
const { OBJ_STORE_DIRECTORY } = require("../constants")

const BB_CDN = "https://cdn.app.budi.live/assets"
const APP_PREFIX = DocumentTypes.APP + SEPARATOR

function confirmAppId(possibleAppId) {
  return possibleAppId && possibleAppId.startsWith(APP_PREFIX)
    ? possibleAppId
    : undefined
}

exports.wait = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.isDev = env.isDev

/**
 * Given a request tries to find the appId, which can be located in various places
 * @param {object} ctx The main request body to look through.
 * @returns {string|undefined} If an appId was found it will be returned.
 */
exports.getAppId = ctx => {
  const options = [ctx.headers["x-budibase-app-id"], ctx.params.appId]
  if (ctx.subdomains) {
    options.push(ctx.subdomains[1])
  }
  let appId
  for (let option of options) {
    appId = confirmAppId(option)
    if (appId) {
      break
    }
  }

  // look in body if can't find it in subdomain
  if (!appId && ctx.request.body && ctx.request.body.appId) {
    appId = confirmAppId(ctx.request.body.appId)
  }
  let appPath =
    ctx.request.headers.referrer ||
    ctx.path.split("/").filter(subPath => subPath.startsWith(APP_PREFIX))
  if (!appId && appPath.length !== 0) {
    appId = confirmAppId(appPath[0])
  }
  return appId
}

/**
 * Get the name of the cookie which is to be updated/retrieved
 * @param {string|undefined|null} name OPTIONAL can specify the specific app if previewing etc
 * @returns {string} The name of the token trying to find
 */
exports.getCookieName = (name = "builder") => {
  let environment = env.isProd() ? "cloud" : "local"
  return `budibase:${name}:${environment}`
}

/**
 * Store a cookie for the request, has a hardcoded expiry.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to set.
 * @param {string|object} value The value of cookie which will be set.
 */
exports.setCookie = (ctx, value, name = "builder") => {
  const expires = new Date()
  expires.setDate(expires.getDate() + 1)

  const cookieName = exports.getCookieName(name)
  if (!value) {
    ctx.cookies.set(cookieName)
  } else {
    ctx.cookies.set(cookieName, value, {
      expires,
      path: "/",
      httpOnly: false,
      overwrite: true,
    })
  }
}

/**
 * Utility function, simply calls setCookie with an empty string for value
 */
exports.clearCookie = (ctx, name) => {
  exports.setCookie(ctx, "", name)
}

/**
 * Checks if the API call being made (based on the provided ctx object) is from the client. If
 * the call is not from a client app then it is from the builder.
 * @param {object} ctx The koa context object to be tested.
 * @return {boolean} returns true if the call is from the client lib (a built app rather than the builder).
 */
exports.isClient = ctx => {
  return ctx.headers["x-budibase-type"] === "client"
}

/**
 * Lots of different points in the app need to find the full list of apps, this will
 * enumerate the entire CouchDB cluster and get the list of databases (every app).
 * NOTE: this operation is fine in self hosting, but cannot be used when hosting many
 * different users/companies apps as there is no security around it - all apps are returned.
 * @return {Promise<object[]>} returns the app information document stored in each app database.
 */
exports.getAllApps = async () => {
  let allDbs = await CouchDB.allDbs()
  const appDbNames = allDbs.filter(dbName => dbName.startsWith(APP_PREFIX))
  const appPromises = appDbNames.map(db => new CouchDB(db).get(db))
  if (appPromises.length === 0) {
    return []
  } else {
    const response = await Promise.allSettled(appPromises)
    return response
      .filter(result => result.status === "fulfilled")
      .map(({ value }) => value)
  }
}

/**
 * Makes sure that a URL has the correct number of slashes, while maintaining the
 * http(s):// double slashes.
 * @param {string} url The URL to test and remove any extra double slashes.
 * @return {string} The updated url.
 */
exports.checkSlashesInUrl = url => {
  return url.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
}

/**
 * Gets the address of the object store, depending on whether self hosted or in cloud.
 * @return {string} The base URL of the object store (MinIO or S3).
 */
exports.objectStoreUrl = () => {
  if (env.SELF_HOSTED) {
    // can use a relative url for this as all goes through the proxy (this is hosted in minio)
    return OBJ_STORE_DIRECTORY
  } else {
    return BB_CDN
  }
}

/**
 * In production the client library is stored in the object store, however in development
 * we use the symlinked version produced by lerna, located in node modules. We link to this
 * via a specific endpoint (under /api/assets/client).
 * @param {string} appId In production we need the appId to look up the correct bucket, as the
 * version of the client lib may differ between apps.
 * @return {string} The URL to be inserted into appPackage response or server rendered
 * app index file.
 */
exports.clientLibraryPath = appId => {
  if (env.isProd()) {
    return `${exports.objectStoreUrl()}/${appId}/budibase-client.js`
  } else {
    return `/api/assets/client`
  }
}
