import env from "../environment"

const SLOT_REFRESH_MS = 2000
const CONNECT_TIMEOUT_MS = 10000
export const SEPARATOR = "-"

/**
 * These Redis databases help us to segment up a Redis keyspace by prepending the
 * specified database name onto the cache key. This means that a single real Redis database
 * can be split up a bit; allowing us to use scans on small databases to find some particular
 * keys within.
 * If writing a very large volume of keys is expected (say 10K+) then it is better to keep these out
 * of the default keyspace and use a separate one - the SelectableDatabase can be used for this.
 */
export enum Databases {
  PW_RESETS = "pwReset",
  VERIFICATIONS = "verification",
  INVITATIONS = "invitation",
  DEV_LOCKS = "devLocks",
  DEBOUNCE = "debounce",
  SESSIONS = "session",
  USER_CACHE = "users",
  FLAGS = "flags",
  APP_METADATA = "appMetadata",
  QUERY_VARS = "queryVars",
  LICENSES = "license",
  GENERIC_CACHE = "data_cache",
  WRITE_THROUGH = "writeThrough",
  LOCKS = "locks",
  SOCKET_IO = "socket_io",
}

/**
 * These define the numeric Redis databases that can be access with the SELECT command -
 * (https://redis.io/commands/select/). By default a Redis server/cluster will have 16 selectable
 * databases, increasing this count increases the amount of CPU/memory required to run the server.
 * Ideally new Redis keyspaces should be used sparingly, only when absolutely necessary for performance
 * to be maintained. Generally a keyspace can grow to be very large is scans are not needed or desired,
 * but if you need to walk through all values in a database periodically then a separate selectable
 * keyspace should be used.
 */
export enum SelectableDatabase {
  DEFAULT = 0,
  SOCKET_IO = 1,
  UNUSED_1 = 2,
  UNUSED_2 = 3,
  UNUSED_3 = 4,
  UNUSED_4 = 5,
  UNUSED_5 = 6,
  UNUSED_6 = 7,
  UNUSED_7 = 8,
  UNUSED_8 = 9,
  UNUSED_9 = 10,
  UNUSED_10 = 11,
  UNUSED_11 = 12,
  UNUSED_12 = 13,
  UNUSED_13 = 14,
  UNUSED_14 = 15,
}

export function getRedisOptions() {
  let password = env.REDIS_PASSWORD
  let url: string[] | string = env.REDIS_URL.split("//")
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
  if (/rediss?:\/\//.test(env.REDIS_URL)) {
    redisProtocolUrl = env.REDIS_URL
  }

  const opts: any = {
    connectTimeout: CONNECT_TIMEOUT_MS,
  }
  if (env.REDIS_CLUSTERED) {
    opts.redisOptions = {}
    opts.redisOptions.tls = {}
    opts.redisOptions.password = password
    opts.slotsRefreshTimeout = SLOT_REFRESH_MS
    opts.dnsLookup = (address: string, callback: any) => callback(null, address)
  } else {
    opts.host = host
    opts.port = port
    opts.password = password
  }
  return { opts, host, port: parseInt(port), redisProtocolUrl }
}

export function addDbPrefix(db: string, key: string) {
  if (key.includes(db)) {
    return key
  }
  return `${db}${SEPARATOR}${key}`
}

export function removeDbPrefix(key: string) {
  let parts = key.split(SEPARATOR)
  if (parts.length >= 2) {
    parts.shift()
    return parts.join(SEPARATOR)
  } else {
    // return the only part
    return parts[0]
  }
}
