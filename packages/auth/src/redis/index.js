const env = require("../environment")
// ioredis mock is all in memory
const Redis = env.isTest() ? require("ioredis-mock") : require("ioredis")
const { addDbPrefix, removeDbPrefix, getRedisOptions } = require("./utils")

const RETRY_PERIOD_MS = 2000
const CLUSTERED = false

// for testing just generate the client once
let CONNECTED = false
let CLIENT = env.isTest() ? new Redis(getRedisOptions()) : null

/**
 * Inits the system, will error if unable to connect to redis cluster (may take up to 10 seconds) otherwise
 * will return the ioredis client which will be ready to use.
 */
function init() {
  function errorOccurred(err) {
    CONNECTED = false
    console.error("Redis connection failed - " + err)
    setTimeout(() => {
      init()
    }, RETRY_PERIOD_MS)
  }
  // testing uses a single in memory client
  if (env.isTest() || (CLIENT && CONNECTED)) {
    return
  }
  if (CLIENT) {
    CLIENT.disconnect()
  }
  const { opts, host, port } = getRedisOptions(CLUSTERED)
  if (CLUSTERED) {
    CLIENT = new Redis.Cluster([{ host, port }], opts)
  } else {
    CLIENT = new Redis(opts)
  }
  CLIENT.on("end", err => {
    errorOccurred(err)
  })
  CLIENT.on("error", err => {
    errorOccurred(err)
  })
  CLIENT.on("connect", () => {
    CONNECTED = true
  })
}

function waitForConnection() {
  return new Promise(resolve => {
    if (CLIENT == null) {
      init()
    } else if (CONNECTED) {
      resolve()
      return
    }
    CLIENT.on("connect", () => {
      resolve()
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
    init()
    await waitForConnection()
    return this
  }

  async finish() {
    CLIENT.disconnect()
  }

  async scan() {
    const db = this._db
    let stream
    if (CLUSTERED) {
      let node = CLIENT.nodes("master")
      stream = node[0].scanStream({ match: db + "-*", count: 100 })
    } else {
      stream = CLIENT.scanStream({ match: db + "-*", count: 100 })
    }
    return promisifyStream(stream)
  }

  async get(key) {
    const db = this._db
    let response = await CLIENT.get(addDbPrefix(db, key))
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
    const db = this._db
    if (typeof value === "object") {
      value = JSON.stringify(value)
    }
    const prefixedKey = addDbPrefix(db, key)
    await CLIENT.set(prefixedKey, value)
    if (expirySeconds) {
      await CLIENT.expire(prefixedKey, expirySeconds)
    }
  }

  async delete(key) {
    const db = this._db
    await CLIENT.del(addDbPrefix(db, key))
  }

  async clear() {
    let items = await this.scan()
    await Promise.all(items.map(obj => this.delete(obj.key)))
  }
}

module.exports = RedisWrapper
