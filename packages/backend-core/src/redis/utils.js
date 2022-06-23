const env = require("../environment")

const SLOT_REFRESH_MS = 2000
const CONNECT_TIMEOUT_MS = 10000
const SEPARATOR = "-"
const REDIS_URL = !env.REDIS_URL ? "localhost:6379" : env.REDIS_URL
const REDIS_PASSWORD = !env.REDIS_PASSWORD ? "budibase" : env.REDIS_PASSWORD

exports.Databases = {
  PW_RESETS: "pwReset",
  VERIFICATIONS: "verification",
  INVITATIONS: "invitation",
  DEV_LOCKS: "devLocks",
  DEBOUNCE: "debounce",
  SESSIONS: "session",
  USER_CACHE: "users",
  FLAGS: "flags",
  APP_METADATA: "appMetadata",
  QUERY_VARS: "queryVars",
  LICENSES: "license",
  GENERIC_CACHE: "data_cache",
  WRITE_THROUGH: "writeThrough",
}

exports.SelectableDatabases = {
  DEFAULT: 0,
  WRITE_THROUGH: 1,
  UNUSED_1: 2,
  UNUSED_2: 3,
  UNUSED_3: 4,
  UNUSED_4: 5,
  UNUSED_5: 6,
  UNUSED_6: 7,
  UNUSED_7: 8,
  UNUSED_8: 9,
  UNUSED_9: 10,
  UNUSED_10: 11,
  UNUSED_11: 12,
  UNUSED_12: 13,
  UNUSED_13: 14,
  UNUSED_14: 15,
}

exports.SEPARATOR = SEPARATOR

exports.getRedisOptions = (clustered = false) => {
  let password = REDIS_PASSWORD
  let url = REDIS_URL.split("//")
  // get rid of the protocol
  url = url.length > 1 ? url[1] : url[0]
  // check for a password etc
  url = url.split("@")
  if (url.length > 1) {
    // get the password
    password = url[0].split(":")[1]
    url = url[1]
  } else {
    url = url[0]
  }
  const [host, port] = url.split(":")

  let redisProtocolUrl

  // fully qualified redis URL
  if (/rediss?:\/\//.test(REDIS_URL)) {
    redisProtocolUrl = REDIS_URL
  }

  const opts = {
    connectTimeout: CONNECT_TIMEOUT_MS,
  }
  if (clustered) {
    opts.redisOptions = {}
    opts.redisOptions.tls = {}
    opts.redisOptions.password = password
    opts.slotsRefreshTimeout = SLOT_REFRESH_MS
    opts.dnsLookup = (address, callback) => callback(null, address)
  } else {
    opts.host = host
    opts.port = port
    opts.password = password
  }
  return { opts, host, port, redisProtocolUrl }
}

exports.addDbPrefix = (db, key) => {
  if (key.includes(db)) {
    return key
  }
  return `${db}${SEPARATOR}${key}`
}

exports.removeDbPrefix = key => {
  let parts = key.split(SEPARATOR)
  if (parts.length >= 2) {
    parts.shift()
    return parts.join(SEPARATOR)
  } else {
    // return the only part
    return parts[0]
  }
}
