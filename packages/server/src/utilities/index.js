const env = require("../environment")
const { DocumentTypes, SEPARATOR } = require("../db/utils")
const fs = require("fs")
const { cloneDeep } = require("lodash/fp")
const CouchDB = require("../db")

const APP_PREFIX = DocumentTypes.APP + SEPARATOR

/**
 * A map of how we convert various properties in rows to each other based on the row type.
 */
const TYPE_TRANSFORM_MAP = {
  link: {
    "": [],
    [null]: [],
    [undefined]: undefined,
  },
  options: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  string: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  longform: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  number: {
    "": null,
    [null]: null,
    [undefined]: undefined,
    parse: n => parseFloat(n),
  },
  datetime: {
    "": null,
    [undefined]: undefined,
    [null]: null,
  },
  attachment: {
    "": [],
    [null]: [],
    [undefined]: undefined,
  },
  boolean: {
    "": null,
    [null]: null,
    [undefined]: undefined,
    true: true,
    false: false,
  },
}

function confirmAppId(possibleAppId) {
  return possibleAppId && possibleAppId.startsWith(APP_PREFIX)
    ? possibleAppId
    : undefined
}

exports.wait = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.isDev = () => {
  return (
    !env.CLOUD &&
    env.NODE_ENV !== "production" &&
    env.NODE_ENV !== "jest" &&
    env.NODE_ENV !== "cypress"
  )
}

/**
 * Given a request tries to find the appId, which can be located in various places
 * @param {object} ctx The main request body to look through.
 * @returns {string|undefined} If an appId was found it will be returned.
 */
exports.getAppId = ctx => {
  let appId = confirmAppId(ctx.headers["x-budibase-app-id"])
  if (!appId) {
    appId = confirmAppId(env.CLOUD ? ctx.subdomains[1] : ctx.params.appId)
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
  let environment = env.CLOUD ? "cloud" : "local"
  return `budibase:${name}:${environment}`
}

/**
 * Store a cookie for the request, has a hardcoded expiry.
 * @param {object} ctx The request which is to be manipulated.
 * @param {string} name The name of the cookie to set.
 * @param {string|object} value The value of cookie which will be set.
 */
exports.setCookie = (ctx, name, value) => {
  const expires = new Date()
  expires.setDate(expires.getDate() + 1)

  ctx.cookies.set(exports.getCookieName(name), value, {
    expires,
    path: "/",
    httpOnly: false,
    overwrite: true,
  })
}

exports.isClient = ctx => {
  return ctx.headers["x-budibase-type"] === "client"
}

/**
 * Recursively walk a directory tree and execute a callback on all files.
 * @param {String} dirPath - Directory to traverse
 * @param {Function} callback - callback to execute on files
 */
exports.walkDir = (dirPath, callback) => {
  for (let filename of fs.readdirSync(dirPath)) {
    const filePath = `${dirPath}/${filename}`
    const stat = fs.lstatSync(filePath)

    if (stat.isFile()) {
      callback(filePath)
    } else {
      exports.walkDir(filePath, callback)
    }
  }
}

/**
 * This will coerce a value to the correct types based on the type transform map
 * @param {object} row The value to coerce
 * @param {object} type The type fo coerce to
 * @returns {object} The coerced value
 */
exports.coerceValue = (value, type) => {
  // eslint-disable-next-line no-prototype-builtins
  if (TYPE_TRANSFORM_MAP[type].hasOwnProperty(value)) {
    return TYPE_TRANSFORM_MAP[type][value]
  } else if (TYPE_TRANSFORM_MAP[type].parse) {
    return TYPE_TRANSFORM_MAP[type].parse(value)
  }

  return value
}

/**
 * This will coerce the values in a row to the correct types based on the type transform map and the
 * table schema.
 * @param {object} row The row which is to be coerced to correct values based on schema, this input
 * row will not be updated.
 * @param {object} table The table that has been retrieved from DB, this must contain the expected
 * schema for the rows.
 * @returns {object} The updated row will be returned with all values coerced.
 */
exports.coerceRowValues = (row, table) => {
  const clonedRow = cloneDeep(row)
  for (let [key, value] of Object.entries(clonedRow)) {
    const field = table.schema[key]
    if (!field) continue

    clonedRow[key] = exports.coerceValue(value, field.type)
  }
  return clonedRow
}

exports.getLogoUrl = () => {
  return "https://d33wubrfki0l68.cloudfront.net/aac32159d7207b5085e74a7ef67afbb7027786c5/2b1fd/img/logo/bb-emblem.svg"
}

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
