import env from "../environment"
import Redis, { Cluster, ScanStream } from "ioredis"

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
  getRedisConnectionDetails,
  getRedisClusterOptions,
} from "./utils"

async function init(
  selectDb = SelectableDatabase.DEFAULT
): Promise<Redis | Cluster> {
  // testing uses a single in memory client
  if (env.MOCK_REDIS) {
    return new MockRedis(getRedisOptions())
  }

  let client: Redis | Cluster
  if (env.REDIS_CLUSTERED) {
    const { host, port } = getRedisConnectionDetails()
    client = new Cluster([{ host, port }], getRedisClusterOptions())
  } else {
    client = new Redis(getRedisOptions())
  }

  return new Promise<Redis | Cluster>((resolve, reject) => {
    client.on("error", (err: Error | string) => {
      console.error("failed to connect to redis", err)
      reject(err)
    })

    client.on("connect", () => {
      console.log(`Connected to Redis DB: ${selectDb}`)
      resolve(client)
    })
  })
}

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
  db: string
  client: Redis | Cluster

  private constructor(client: Redis | Cluster, db: string) {
    this.client = client
    this.db = db
  }

  static async init(db: string, selectDb: number = SelectableDatabase.DEFAULT) {
    const client = await init(selectDb)
    if (selectDb && !env.isTest()) {
      client.select(selectDb)
    }
    return new RedisWrapper(client, db)
  }

  async finish() {
    this.client.disconnect()
  }

  async scan(key = ""): Promise<any> {
    key = `${this.db}${SEPARATOR}${key}`
    let stream
    if (env.REDIS_CLUSTERED) {
      let node = (this.client as never as Cluster).nodes("master")
      stream = node[0].scanStream({ match: key + "*", count: 100 })
    } else {
      stream = (this.client as Redis).scanStream({
        match: key + "*",
        count: 100,
      })
    }
    return promisifyStream(stream, this)
  }

  async keys(pattern: string) {
    return this.client.keys(addDbPrefix(this.db, pattern))
  }

  async exists(key: string) {
    return await this.client.exists(addDbPrefix(this.db, key))
  }

  async get(key: string) {
    const response = await this.client.get(addDbPrefix(this.db, key))
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
    if (keys.length === 0) {
      return {}
    }
    const prefixedKeys = keys.map(key => addDbPrefix(this.db, key))
    let response = await this.client.mget(prefixedKeys)
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
    if (typeof value === "object") {
      value = JSON.stringify(value)
    }
    const prefixedKey = addDbPrefix(this.db, key)
    await this.client.set(prefixedKey, value)
    if (expirySeconds) {
      await this.client.expire(prefixedKey, expirySeconds)
    }
  }

  async bulkStore(
    data: Record<string, any>,
    expirySeconds: number | null = null
  ) {
    const dataToStore = Object.entries(data).reduce((acc, [key, value]) => {
      acc[addDbPrefix(this.db, key)] =
        typeof value === "object" ? JSON.stringify(value) : value
      return acc
    }, {} as Record<string, any>)

    const pipeline = this.client.pipeline()
    pipeline.mset(dataToStore)

    if (expirySeconds !== null) {
      for (const key of Object.keys(dataToStore)) {
        pipeline.expire(key, expirySeconds)
      }
    }

    await pipeline.exec()
  }

  async getTTL(key: string) {
    return this.client.ttl(addDbPrefix(this.db, key))
  }

  async setExpiry(key: string, expirySeconds: number) {
    await this.client.expire(addDbPrefix(this.db, key), expirySeconds)
  }

  async delete(key: string) {
    await this.client.del(addDbPrefix(this.db, key))
  }

  async bulkDelete(keys: string[]) {
    await this.client.del(keys.map(key => addDbPrefix(this.db, key)))
  }

  async clear() {
    let items = await this.scan()
    await Promise.all(items.map((obj: any) => this.delete(obj.key)))
  }

  async increment(key: string) {
    const result = await this.client.incr(addDbPrefix(this.db, key))
    if (isNaN(result)) {
      throw new Error(`Redis ${key} does not contain a number`)
    }
    return result
  }

  async deleteIfValue(key: string, value: any) {
    const luaScript = `
      if redis.call('GET', KEYS[1]) == ARGV[1] then
        redis.call('DEL', KEYS[1])
      end
      `
    await this.client.eval(luaScript, 1, addDbPrefix(this.db, key), value)
  }
}

export default RedisWrapper
