const env = require("../environment")

const SLOT_REFRESH_MS = 2000
const CONNECT_TIMEOUT_MS = 10000
const SEPARATOR = "-"

exports.Databases = {
  PW_RESETS: "pwReset",
}

exports.getRedisOptions = (clustered = false) => {
  const [host, port] = env.REDIS_URL.split(":")
  const opts = {
    connectTimeout: CONNECT_TIMEOUT_MS,
  }
  if (clustered) {
    opts.redisOptions = {}
    opts.redisOptions.tls = {}
    opts.redisOptions.password = env.REDIS_PASSWORD
    opts.slotsRefreshTimeout = SLOT_REFRESH_MS
    opts.dnsLookup = (address, callback) => callback(null, address)
  } else {
    opts.host = host
    opts.port = port
    opts.password = env.REDIS_PASSWORD
  }
  return { opts, host, port }
}

exports.addDbPrefix = (db, key) => {
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
