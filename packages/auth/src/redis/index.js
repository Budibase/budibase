const env = require("../environment")
// ioredis mock is all in memory
const Redis = env.isTest() ? require("ioredis-mock") : require("ioredis")
const {
  addDbPrefix,
  removeDbPrefix,
  getRedisOptions,
  SEPARATOR,
} = require("./utils")

const RETRY_PERIOD_MS = 2000
const STARTUP_TIMEOUT_MS = 5000
const CLUSTERED = false

// for testing just generate the client once
let CLOSED = false
let CLIENT = env.isTest() ? new Redis(getRedisOptions()) : null
// if in test always connected
let CONNECTED = !!env.isTest()

function connectionError(timeout, err) {
  // manually shut down, ignore errors
  if (CLOSED) {
    return
  }
  CLIENT.end()
  CLOSED = true
  // always clear this on error
  clearTimeout(timeout)
  CONNECTED = false
  console.error("Redis connection failed - " + err)
  setTimeout(() => {
    init()
  }, RETRY_PERIOD_MS)
}

/**
 * Inits the system, will error if unable to connect to redis cluster (may take up to 10 seconds) otherwise
 * will return the ioredis client which will be ready to use.
 */
function init() {
  let timeout
  CLOSED = false
  // testing uses a single in memory client
  if (env.isTest() || (CLIENT && CONNECTED)) {
    return
  }
  // start the timer - only allowed 5 seconds to connect
  timeout = setTimeout(() => {
    if (!CONNECTED) {
      connectionError(timeout, "Did not successfully connect in timeout")
    }
  }, STARTUP_TIMEOUT_MS)

  // disconnect any lingering client
  if (CLIENT) {
    CLIENT.disconnect()
  }
  const { opts, host, port } = getRedisOptions(CLUSTERED)
  if (CLUSTERED) {
    CLIENT = new Redis.Cluster([{ host, port }], opts)
  } else {
    CLIENT = new Redis(opts)
  }
  // attach handlers
  CLIENT.on("end", err => {
    connectionError(timeout, err)
  })
  CLIENT.on("error", err => {
    connectionError(timeout, err)
  })
  CLIENT.on("connect", () => {
    clearTimeout(timeout)
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
    // check if the connection is ready
    const interval = setInterval(() => {
      if (CONNECTED) {
        clearInterval(interval)
        resolve()
      }
    }, 500)
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
    CLOSED = false
    init()
    await waitForConnection()
    return this
  }

  async finish() {
    CLOSED = true
    CLIENT.disconnect()
  }

  async scan(key = "") {
    const db = this._db
    key = `${db}${SEPARATOR}${key}`
    let stream
    if (CLUSTERED) {
      let node = CLIENT.nodes("master")
      stream = node[0].scanStream({ match: key + "*", count: 100 })
    } else {
      stream = CLIENT.scanStream({ match: key + "*", count: 100 })
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

  async setExpiry(key, expirySeconds) {
    const db = this._db
    const prefixedKey = addDbPrefix(db, key)
    await CLIENT.expire(prefixedKey, expirySeconds)
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
