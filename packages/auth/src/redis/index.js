const env = require("../environment")
// ioredis mock is all in memory
const Redis = env.isTest() ? require("ioredis-mock") : require("ioredis")
const { addDbPrefix, removeDbPrefix, getRedisOptions } = require("./utils")

const CLUSTERED = false

// for testing just generate the client once
let CONNECTED = false
let CLIENT = env.isTest() ? new Redis(getRedisOptions()) : null

/**
 * Inits the system, will error if unable to connect to redis cluster (may take up to 10 seconds) otherwise
 * will return the ioredis client which will be ready to use.
 * @return {Promise<object>} The ioredis client.
 */
function init() {
  return new Promise((resolve, reject) => {
    // testing uses a single in memory client
    if (env.isTest()) {
      return resolve(CLIENT)
    }
    // if a connection existed, close it and re-create it
    if (CLIENT && CONNECTED) {
      return CLIENT
    }
    const { opts, host, port } = getRedisOptions(CLUSTERED)
    if (CLUSTERED) {
      CLIENT = new Redis.Cluster([{ host, port }], opts)
    } else {
      CLIENT = new Redis(opts)
    }
    CLIENT.on("end", err => {
      reject(err)
      CONNECTED = false
    })
    CLIENT.on("error", err => {
      reject(err)
      CONNECTED = false
    })
    CLIENT.on("connect", () => {
      resolve(CLIENT)
      CONNECTED = true
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
    stream.on("error", err => {
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
        resolve(
          keysArray.map(key => ({
            key: removeDbPrefix(key),
            value: JSON.parse(jsonArray.shift()),
          }))
        )
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

  async finish() {
    this._client.disconnect()
  }

  async scan() {
    const db = this._db,
      client = this._client
    let stream
    if (CLUSTERED) {
      let node = client.nodes("master")
      stream = node[0].scanStream({ match: db + "-*", count: 100 })
    } else {
      stream = client.scanStream({ match: db + "-*", count: 100 })
    }
    return promisifyStream(stream)
  }

  async get(key) {
    const db = this._db,
      client = this._client
    let response = await client.get(addDbPrefix(db, key))
    // overwrite the prefixed key
    if (response != null && response.key) {
      response.key = key
    }
    // if its not an object just return the response
    try {
      return JSON.parse(response)
    } catch (err) {
      return response
    }
  }

  async store(key, value, expirySeconds = null) {
    const db = this._db,
      client = this._client
    if (typeof value === "object") {
      value = JSON.stringify(value)
    }
    const prefixedKey = addDbPrefix(db, key)
    await client.set(prefixedKey, value)
    if (expirySeconds) {
      await client.expire(prefixedKey, expirySeconds)
    }
  }

  async delete(key) {
    const db = this._db,
      client = this._client
    await client.del(addDbPrefix(db, key))
  }

  async clear() {
    let items = await this.scan()
    await Promise.all(items.map(obj => this.delete(obj.key)))
  }
}

module.exports = RedisWrapper
