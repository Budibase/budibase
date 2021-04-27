const Redis = require("ioredis")
const env = require("../environment")
const { addDbPrefix, removeDbPrefix } = require("./utils")

const CONNECT_TIMEOUT_MS = 10000
const SLOT_REFRESH_MS = 2000
const CLUSTERED = false

let CLIENT

/**
 * Inits the system, will error if unable to connect to redis cluster (may take up to 10 seconds) otherwise
 * will return the ioredis client which will be ready to use.
 * @return {Promise<object>} The ioredis client.
 */
function init() {
  return new Promise((resolve, reject) => {
    const [ host, port ] = env.REDIS_URL.split(":")
    const opts = {
      connectTimeout: CONNECT_TIMEOUT_MS
    }
    if (CLUSTERED) {
      opts.redisOptions = {}
      opts.redisOptions.tls = {}
      opts.redisOptions.password = env.REDIS_PASSWORD
      opts.slotsRefreshTimeout = SLOT_REFRESH_MS
      opts.dnsLookup = (address, callback) => callback(null, address)
      CLIENT = new Redis.Cluster([ { port, host } ])
    } else {
      opts.password = env.REDIS_PASSWORD
      opts.port = port
      opts.host = host
      CLIENT = new Redis(opts)
    }
    CLIENT.on("end", err => {
      reject(err)
    })
    CLIENT.on("error", err => {
      reject(err)
    })
    CLIENT.on("connect", () => {
      resolve(CLIENT)
    })
  })
}

/**
 * Utility function, takes a redis stream and converts it to a promisified response -
 * this can only be done with redis streams because they will have an end.
 * @param stream A redis stream, specifically as this type of stream will have an end.
 * @return {Promise<object>} The final output of the stream
 */
function promisifyStream(stream) {
  return new Promise((resolve, reject) => {
    const outputKeys = new Set()
    stream.on("data", keys => {
      keys.forEach(key => {
        outputKeys.add(key)
      })
    })
    stream.on("error", (err) => {
      reject(err)
    })
    stream.on("end", async () => {
      const keysArray = Array.from(outputKeys)
      try {
        let getPromises = []
        for (let key of keysArray) {
          getPromises.push(CLIENT.get(key))
        }
        const jsonArray = await Promise.all(getPromises)
        resolve(keysArray.map(key => ({
          key: removeDbPrefix(key),
          value: JSON.parse(jsonArray.shift()),
        })))
      } catch (err) {
        reject(err)
      }
    })
  })
}

class RedisWrapper {
  constructor(db) {
    this._db = db
  }

  async init() {
    this._client = await init()
    return this
  }

  async scan() {
    const db = this._db, client = this._client
    let stream
    if (CLUSTERED) {
      let node = client.nodes("master")
      stream = node[0].scanStream({match: db + "-*", count: 100})

    } else {
      stream = client.scanStream({match: db + "-*", count: 100})
    }
    return promisifyStream(stream)
  }

  async get(key) {
    const db = this._db, client = this._client
    let response = await client.get(addDbPrefix(db, key))
    // overwrite the prefixed key
    if (response != null && response.key) {
      response.key = key
    }
    return JSON.parse(response)
  }

  async store(key, value, expirySeconds = null) {
    const db = this._db, client = this._client
    if (typeof(value) === "object") {
      value = JSON.stringify(value)
    }
    const prefixedKey = addDbPrefix(db, key)
    await client.set(prefixedKey, value)
    if (expirySeconds) {
      await client.expire(prefixedKey, expirySeconds)
    }
  }

  async delete(key) {
    const db = this._db, client = this._client
    await client.del(addDbPrefix(db, key))
  }

  async clear() {
    const db = this._db
    let items = await this.scan(db)
    await Promise.all(items.map(obj => this.delete(db, obj.key)))
  }
}

module.exports = RedisWrapper
