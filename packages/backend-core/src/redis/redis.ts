import env from "../environment"
import Redis from "ioredis"
// mock-redis doesn't have any typing
let MockRedis: any | undefined
if (env.MOCK_REDIS) {
  try {
    // ioredis mock is all in memory
    MockRedis = require("ioredis-mock")
  } catch (err) {
    console.log("Mock redis unavailable")
  }
}
import {
  addDbPrefix,
  removeDbPrefix,
  getRedisOptions,
  SEPARATOR,
  SelectableDatabase,
} from "./utils"
import * as timers from "../timers"

const RETRY_PERIOD_MS = 2000
const STARTUP_TIMEOUT_MS = 5000
const CLUSTERED = env.REDIS_CLUSTERED
const DEFAULT_SELECT_DB = SelectableDatabase.DEFAULT

// for testing just generate the client once
let CLOSED = false
let CLIENTS: { [key: number]: any } = {}
0
let CONNECTED = false

// mock redis always connected
if (env.MOCK_REDIS) {
  CONNECTED = true
}

function pickClient(selectDb: number): any {
  return CLIENTS[selectDb]
}

function connectionError(
  selectDb: number,
  timeout: NodeJS.Timeout,
  err: Error | string
) {
  // manually shut down, ignore errors
  if (CLOSED) {
    return
  }
  pickClient(selectDb).disconnect()
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
function init(selectDb = DEFAULT_SELECT_DB) {
  const RedisCore = env.MOCK_REDIS && MockRedis ? MockRedis : Redis
  let timeout: NodeJS.Timeout
  CLOSED = false
  let client = pickClient(selectDb)
  // already connected, ignore
  if (client && CONNECTED) {
    return
  }
  // testing uses a single in memory client
  if (env.MOCK_REDIS) {
    CLIENTS[selectDb] = new RedisCore(getRedisOptions())
  }
  // start the timer - only allowed 5 seconds to connect
  timeout = setTimeout(() => {
    if (!CONNECTED) {
      connectionError(
        selectDb,
        timeout,
        "Did not successfully connect in timeout"
      )
    }
  }, STARTUP_TIMEOUT_MS)

  // disconnect any lingering client
  if (client) {
    client.disconnect()
  }
  const { redisProtocolUrl, opts, host, port } = getRedisOptions()

  if (CLUSTERED) {
    client = new RedisCore.Cluster([{ host, port }], opts)
  } else if (redisProtocolUrl) {
    client = new RedisCore(redisProtocolUrl)
  } else {
    client = new RedisCore(opts)
  }
  // attach handlers
  client.on("end", (err: Error) => {
    if (env.isTest()) {
      // don't try to re-connect in test env
      // allow the process to exit
      return
    }
    connectionError(selectDb, timeout, err)
  })
  client.on("error", (err: Error) => {
    connectionError(selectDb, timeout, err)
  })
  client.on("connect", () => {
    clearTimeout(timeout)
    CONNECTED = true
  })
  CLIENTS[selectDb] = client
}

function waitForConnection(selectDb: number = DEFAULT_SELECT_DB) {
  return new Promise(resolve => {
    if (pickClient(selectDb) == null) {
      init()
    } else if (CONNECTED) {
      resolve("")
      return
    }
    // check if the connection is ready
    const interval = timers.set(() => {
      if (CONNECTED) {
        timers.clear(interval)
        resolve("")
      }
    }, 500)
  })
}

/**
 * Utility function, takes a redis stream and converts it to a promisified response -
 * this can only be done with redis streams because they will have an end.
 * @param stream A redis stream, specifically as this type of stream will have an end.
 * @param client The client to use for further lookups.
 * @return {Promise<object>} The final output of the stream
 */
function promisifyStream(stream: any, client: RedisWrapper) {
  return new Promise((resolve, reject) => {
    const outputKeys = new Set()
    stream.on("data", (keys: string[]) => {
      keys.forEach(key => {
        outputKeys.add(key)
      })
    })
    stream.on("error", (err: Error) => {
      reject(err)
    })
    stream.on("end", async () => {
      const keysArray: string[] = Array.from(outputKeys) as string[]
      try {
        let getPromises = []
        for (let key of keysArray) {
          getPromises.push(client.get(key))
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
  _db: string
  _select: number

  constructor(db: string, selectDb: number | null = null) {
    this._db = db
    this._select = selectDb || DEFAULT_SELECT_DB
  }

  getClient() {
    return pickClient(this._select)
  }

  async init() {
    CLOSED = false
    init(this._select)
    await waitForConnection(this._select)
    if (this._select && !env.isTest()) {
      this.getClient().select(this._select)
    }
    return this
  }

  async finish() {
    CLOSED = true
    this.getClient().disconnect()
  }

  async scan(key = ""): Promise<any> {
    const db = this._db
    key = `${db}${SEPARATOR}${key}`
    let stream
    if (CLUSTERED) {
      let node = this.getClient().nodes("master")
      stream = node[0].scanStream({ match: key + "*", count: 100 })
    } else {
      stream = this.getClient().scanStream({ match: key + "*", count: 100 })
    }
    return promisifyStream(stream, this.getClient())
  }

  async keys(pattern: string) {
    const db = this._db
    return this.getClient().keys(addDbPrefix(db, pattern))
  }

  async exists(key: string) {
    const db = this._db
    return await this.getClient().exists(addDbPrefix(db, key))
  }

  async get(key: string) {
    const db = this._db
    let response = await this.getClient().get(addDbPrefix(db, key))
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

  async bulkGet<T>(keys: string[]) {
    const db = this._db
    if (keys.length === 0) {
      return {}
    }
    const prefixedKeys = keys.map(key => addDbPrefix(db, key))
    let response = await this.getClient().mget(prefixedKeys)
    if (Array.isArray(response)) {
      let final: Record<string, T> = {}
      let count = 0
      for (let result of response) {
        if (result) {
          let parsed
          try {
            parsed = JSON.parse(result)
          } catch (err) {
            parsed = result
          }
          final[keys[count]] = parsed
        }
        count++
      }
      return final
    } else {
      throw new Error(`Invalid response: ${response}`)
    }
  }

  async store(key: string, value: any, expirySeconds: number | null = null) {
    const db = this._db
    if (typeof value === "object") {
      value = JSON.stringify(value)
    }
    const prefixedKey = addDbPrefix(db, key)
    await this.getClient().set(prefixedKey, value)
    if (expirySeconds) {
      await this.getClient().expire(prefixedKey, expirySeconds)
    }
  }

  async getTTL(key: string) {
    const db = this._db
    const prefixedKey = addDbPrefix(db, key)
    return this.getClient().ttl(prefixedKey)
  }

  async setExpiry(key: string, expirySeconds: number | null) {
    const db = this._db
    const prefixedKey = addDbPrefix(db, key)
    await this.getClient().expire(prefixedKey, expirySeconds)
  }

  async delete(key: string) {
    const db = this._db
    await this.getClient().del(addDbPrefix(db, key))
  }

  async clear() {
    let items = await this.scan()
    await Promise.all(items.map((obj: any) => this.delete(obj.key)))
  }
}

export default RedisWrapper
