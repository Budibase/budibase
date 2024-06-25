import env from "../environment"
import Redis, { Cluster, ScanStream } from "ioredis"
// mock-redis doesn't have any typing
import {
  addDbPrefix,
  removeDbPrefix,
  getRedisOptions,
  SEPARATOR,
  SelectableDatabase,
  getRedisConnectionDetails,
} from "./utils"

const CLUSTERED = env.REDIS_CLUSTERED
const DEFAULT_SELECT_DB = SelectableDatabase.DEFAULT

const CLIENTS: Record<number, Promise<Redis | Cluster>> = {}

/**
 * Inits the system, will error if unable to connect to redis cluster (may take up to 10 seconds) otherwise
 * will return the ioredis client which will be ready to use.
 */
async function init(selectDb = DEFAULT_SELECT_DB): Promise<Redis | Cluster> {
  if (CLIENTS[selectDb] !== undefined) {
    return CLIENTS[selectDb]
  }

  CLIENTS[selectDb] = new Promise((resolve, reject) => {
    const { host, port } = getRedisConnectionDetails()
    const opts = getRedisOptions()

    let client: Redis | Cluster
    if (CLUSTERED) {
      client = new Cluster([{ host, port }], opts)
    } else {
      client = new Redis(opts)
    }

    client.on("end", reject)
    client.on("error", reject)
    client.on("ready", () => {
      console.log(`Connected to Redis DB: ${selectDb}`)
      resolve(client)
    })
  })
  return CLIENTS[selectDb]
}

/**
 * Utility function, takes a redis stream and converts it to a promisified response -
 * this can only be done with redis streams because they will have an end.
 * @param stream A redis stream, specifically as this type of stream will have an end.
 * @param client The client to use for further lookups.
 * @return The final output of the stream
 */
function promisifyStream(stream: ScanStream, client: RedisWrapper) {
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
  _client?: Redis | Cluster

  constructor(db: string, selectDb?: number) {
    this._db = db
    this._select = selectDb || DEFAULT_SELECT_DB
  }

  async init() {
    if (this._client) {
      return this
    }

    this._client = await init(this._select)
    this._client.select(this._select)
    return this
  }

  getClient() {
    if (!this._client) {
      throw new Error("Redis client not initialized")
    }
    if (this._client.status !== "ready") {
      throw new Error("Redis client not ready, status: " + this._client.status)
    }
    return this._client
  }

  async finish() {
    this._client?.disconnect()
  }

  async scan(key = ""): Promise<any> {
    const db = this._db
    key = `${db}${SEPARATOR}${key}`
    let stream: ScanStream
    if (CLUSTERED) {
      let node = (this.getClient() as never as Cluster).nodes("master")
      stream = node[0].scanStream({ match: key + "*", count: 100 })
    } else {
      stream = (this.getClient() as Redis).scanStream({
        match: key + "*",
        count: 100,
      })
    }
    return promisifyStream(stream, this.getClient() as any)
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
    const response = await this.getClient().get(addDbPrefix(db, key))
    // overwrite the prefixed key
    // @ts-ignore
    if (response != null && response.key) {
      // @ts-ignore
      response.key = key
    }
    // if its not an object just return the response
    try {
      return JSON.parse(response!)
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

  async bulkStore(
    data: Record<string, any>,
    expirySeconds: number | null = null
  ) {
    const client = this.getClient()

    const dataToStore = Object.entries(data).reduce((acc, [key, value]) => {
      acc[addDbPrefix(this._db, key)] =
        typeof value === "object" ? JSON.stringify(value) : value
      return acc
    }, {} as Record<string, any>)

    const pipeline = client.pipeline()
    pipeline.mset(dataToStore)

    if (expirySeconds !== null) {
      for (const key of Object.keys(dataToStore)) {
        pipeline.expire(key, expirySeconds)
      }
    }

    await pipeline.exec()
  }

  async getTTL(key: string) {
    const db = this._db
    const prefixedKey = addDbPrefix(db, key)
    return this.getClient().ttl(prefixedKey)
  }

  async setExpiry(key: string, expirySeconds: number) {
    const db = this._db
    const prefixedKey = addDbPrefix(db, key)
    await this.getClient().expire(prefixedKey, expirySeconds)
  }

  async delete(key: string) {
    const db = this._db
    await this.getClient().del(addDbPrefix(db, key))
  }

  async bulkDelete(keys: string[]) {
    const db = this._db
    await this.getClient().del(keys.map(key => addDbPrefix(db, key)))
  }

  async clear() {
    let items = await this.scan()
    await Promise.all(items.map((obj: any) => this.delete(obj.key)))
  }

  async increment(key: string) {
    const result = await this.getClient().incr(addDbPrefix(this._db, key))
    if (isNaN(result)) {
      throw new Error(`Redis ${key} does not contain a number`)
    }
    return result
  }

  async deleteIfValue(key: string, value: any) {
    const client = this.getClient()

    const luaScript = `
      if redis.call('GET', KEYS[1]) == ARGV[1] then
        redis.call('DEL', KEYS[1])
      end
      `

    await client.eval(luaScript, 1, addDbPrefix(this._db, key), value)
  }
}

export default RedisWrapper
