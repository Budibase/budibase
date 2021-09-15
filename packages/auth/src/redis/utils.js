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
}

exports.SEPARATOR = SEPARATOR

exports.getRedisOptions = (clustered = false) => {
  const [host, port, ...rest] = REDIS_URL.split(":")

  let redisProtocolUrl

  // fully qualified redis URL
  if (rest.length && /rediss?/.test(host)) {
    redisProtocolUrl = REDIS_URL
  }

  const opts = {
    connectTimeout: CONNECT_TIMEOUT_MS,
  }
  if (clustered) {
    opts.redisOptions = {}
    opts.redisOptions.tls = {}
    opts.redisOptions.password = REDIS_PASSWORD
    opts.slotsRefreshTimeout = SLOT_REFRESH_MS
    opts.dnsLookup = (address, callback) => callback(null, address)
  } else {
    opts.host = host
    opts.port = port
    opts.password = REDIS_PASSWORD
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
