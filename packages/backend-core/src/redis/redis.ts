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
  removeDbPrefix,
  getRedisOptions,
  SEPARATOR,
  SelectableDatabase,
  getRedisConnectionDetails,
  getRedisClusterOptions,
} from "./utils"
import { Span, tracer } from "dd-trace"
import { zip } from "lodash"

async function init(db = SelectableDatabase.DEFAULT): Promise<Redis | Cluster> {
  return await tracer.trace("Redis.init", async span => {
    // testing uses a single in memory client
    if (env.MOCK_REDIS) {
      span.addTags({ mock: true })
      return new MockRedis(getRedisOptions())
    }

    let client: Redis | Cluster
    if (env.REDIS_CLUSTERED) {
      span.addTags({ clustered: true })
      const { host, port } = getRedisConnectionDetails()
      client = new Cluster([{ host, port }], getRedisClusterOptions())
    } else {
      client = new Redis(getRedisOptions())
    }

    return new Promise<Redis | Cluster>((resolve, reject) => {
      client.on("error", (err: Error | string) => {
        span.addTags({ error: true })
        console.error(`failed to connect to redis (db: ${db})`, err)
        reject(err)
      })

      client.on("reconnecting", () => {
        console.log(`Redis reconnecting... (db: ${db})`)
      })

      client.on("ready", () => {
        span.addTags({ connected: true })
        console.log(`Redis ready to receive commands (db: ${db})`)
        resolve(client)
      })
    })
  })
}

export interface Entry {
  key: string
  value: any
}
function promisifyStream(
  stream: ScanStream,
  client: Redis | Cluster
): Promise<Entry[]> {
  return new Promise<Entry[]>((resolve, reject) => {
    const keys = new Set<string>()
    stream.on("data", (data: string[]) => data.forEach(k => keys.add(k)))
    stream.on("error", (err: Error) => reject(err))
    stream.on("end", async () => {
      try {
        const promises = Array.from(keys).map(async key => {
          let value = await client.get(key)
          if (value) {
            value = JSON.parse(value)
          }
          return { key: removeDbPrefix(key), value }
        })
        resolve(await Promise.all(promises))
      } catch (err) {
        reject(err)
      }
    })
  })
}

function isCluster(client: Redis | Cluster): client is Cluster {
  return client.isCluster
}

class RedisWrapper {
  db: string
  client: Redis | Cluster

  private constructor(client: Redis | Cluster, db: string) {
    this.client = client
    this.db = db
  }

  static async init(db: string, selectDb: number = SelectableDatabase.DEFAULT) {
    return await tracer.trace("RedisWrapper.init", async span => {
      const client = await init(selectDb)
      if (selectDb && !env.isTest()) {
        span.addTags({ db })
        client.select(selectDb)
      }
      return new RedisWrapper(client, db)
    })
  }

  private trace(name: string, fn: (span: Span) => Promise<any>) {
    return tracer.trace(name, async span => {
      span.addTags({ db: this.db })
      return await fn(span)
    })
  }

  private prefixed(key: string) {
    if (key.includes(this.db)) {
      return key
    }
    return `${this.db}${SEPARATOR}${key}`
  }

  async finish() {
    return await this.trace("RedisWrapper.finish", async () => {
      await this.client.quit()
    })
  }

  async scan(key = ""): Promise<Entry[]> {
    return await this.trace("RedisWrapper.scan", async span => {
      span.addTags({ key })

      key = `${this.db}${SEPARATOR}${key}`
      let stream: ScanStream
      if (isCluster(this.client)) {
        let node = this.client.nodes("master")
        stream = node[0].scanStream({ match: key + "*", count: 100 })
      } else {
        stream = (this.client as Redis).scanStream({
          match: key + "*",
          count: 100,
        })
      }

      const entries = await promisifyStream(stream, this.client)
      span.addTags({ numKeysFound: entries.length })
      return entries
    })
  }

  async keys(pattern: string) {
    return await this.trace("RedisWrapper.keys", async span => {
      span.addTags({ pattern })
      return this.client.keys(this.prefixed(pattern))
    })
  }

  async exists(key: string) {
    return await this.trace("RedisWrapper.exists", async span => {
      span.addTags({ key })
      return await this.client.exists(this.prefixed(key))
    })
  }

  async get(key: string) {
    return await this.trace("RedisWrapper.get", async span => {
      span.addTags({ key })
      const response = await this.client.get(this.prefixed(key))
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
    })
  }

  async bulkGet<T>(keys: string[]): Promise<Record<string, T | null>> {
    return await this.trace("RedisWrapper.bulkGet", async span => {
      span.addTags({ numKeys: keys.length })

      if (keys.length === 0) {
        return {}
      }

      const response = await this.client.mget(
        keys.map(key => this.prefixed(key))
      )

      span.addTags({ numKeysFound: response.length })

      return zip(keys, response).reduce((acc, [key, result]) => {
        if (key === undefined || result === undefined) {
          throw new Error(
            `Keys and response length mismatch: ${keys.length} vs ${response.length}`
          )
        }

        try {
          acc[key] = result ? (JSON.parse(result) as T) : null
        } catch (err) {
          // TODO: this is a filthy lie but downstream code expects this, I have
          // no idea how it actually works if if this branch is ever hit in
          // practice.
          acc[key] = result as T
        }
        return acc
      }, {} as Record<string, T | null>)
    })
  }

  async store(key: string, value: any, expirySeconds: number | null = null) {
    return await this.trace("RedisWrapper.store", async span => {
      span.addTags({ key, expirySeconds })
      if (typeof value === "object") {
        value = JSON.stringify(value)
      }
      await this.client.set(this.prefixed(key), value)
      if (expirySeconds) {
        await this.client.expire(this.prefixed(key), expirySeconds)
      }
    })
  }

  async bulkStore(
    data: Record<string, any>,
    expirySeconds: number | null = null
  ) {
    return await this.trace("RedisWrapper.bulkStore", async span => {
      span.addTags({ numKeys: Object.keys(data).length, expirySeconds })

      const dataToStore = Object.entries(data).reduce((acc, [key, value]) => {
        acc[this.prefixed(key)] =
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
    })
  }

  async getTTL(key: string) {
    return await this.trace("RedisWrapper.getTTL", async span => {
      span.addTags({ key })
      return await this.client.ttl(this.prefixed(key))
    })
  }

  async setExpiry(key: string, expirySeconds: number) {
    return await this.trace("RedisWrapper.setExpiry", async span => {
      span.addTags({ key, expirySeconds })
      return await this.client.expire(this.prefixed(key), expirySeconds)
    })
  }

  async delete(key: string) {
    return await this.trace("RedisWrapper.delete", async span => {
      span.addTags({ key })
      await this.client.del(this.prefixed(key))
    })
  }

  async bulkDelete(keys: string[]) {
    return await this.trace("RedisWrapper.bulkDelete", async span => {
      span.addTags({ numKeys: keys.length })
      await this.client.del(keys.map(key => this.prefixed(key)))
    })
  }

  async clear() {
    return await this.trace("RedisWrapper.clear", async span => {
      let items = await this.scan()
      span.addTags({ numKeys: items.length })
      await Promise.all(items.map(obj => this.delete(obj.key)))
    })
  }

  async increment(key: string): Promise<number> {
    return await this.trace("RedisWrapper.increment", async span => {
      span.addTags({ key })
      const result = await this.client.incr(this.prefixed(key))
      if (isNaN(result)) {
        throw new Error(`Redis ${key} does not contain a number`)
      }
      return result
    })
  }

  async deleteIfValue(key: string, value: any) {
    return await this.trace("RedisWrapper.deleteIfValue", async span => {
      span.addTags({ key })
      const luaScript = `
      if redis.call('GET', KEYS[1]) == ARGV[1] then
        redis.call('DEL', KEYS[1])
      end
      `
      await this.client.eval(luaScript, 1, this.prefixed(key), value)
    })
  }
}

export default RedisWrapper
