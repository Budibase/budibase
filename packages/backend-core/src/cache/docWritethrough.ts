import BaseCache from "./base"
import { getDocWritethroughClient } from "../redis/init"
import { AnyDocument, Database, LockName, LockType } from "@budibase/types"
import * as locks from "../redis/redlockImpl"

const DEFAULT_WRITE_RATE_MS = 10000

let CACHE: BaseCache | null = null
async function getCache() {
  if (!CACHE) {
    const client = await getDocWritethroughClient()
    CACHE = new BaseCache(client)
  }
  return CACHE
}

interface CacheItem {
  nextWrite: number
}

export class DocWritethrough {
  private db: Database
  private _docId: string
  private writeRateMs: number

  private cacheKeyPrefix: string
  private docInfoCacheKey: string

  constructor(
    db: Database,
    docId: string,
    writeRateMs: number = DEFAULT_WRITE_RATE_MS
  ) {
    this.db = db
    this._docId = docId
    this.writeRateMs = writeRateMs
    this.cacheKeyPrefix = `${this.db.name}:${this.docId}`
    this.docInfoCacheKey = `${this.cacheKeyPrefix}:info`
  }

  get docId() {
    return this._docId
  }

  private makeNextWriteInfoItem(): CacheItem {
    return { nextWrite: Date.now() + this.writeRateMs }
  }

  async patch(data: Record<string, any>) {
    const cache = await getCache()

    await this.storeToCache(cache, data)

    const updateDb = await this.shouldUpdateDb(cache)

    if (updateDb) {
      const lockResponse = await locks.doWithLock(
        {
          type: LockType.TRY_ONCE,
          name: LockName.PERSIST_WRITETHROUGH,
          resource: this.docInfoCacheKey,
          ttl: 15000,
        },
        async () => {
          if (await this.shouldUpdateDb(cache)) {
            await this.persistToDb(cache)
            await cache.store(
              this.docInfoCacheKey,
              this.makeNextWriteInfoItem()
            )
          }
        }
      )

      if (!lockResponse.executed) {
        console.log(`Ignoring redlock conflict in write-through cache`)
      }
    }
  }

  private async shouldUpdateDb(cache: BaseCache) {
    const cacheItem = await cache.withCache(this.docInfoCacheKey, null, () =>
      this.makeNextWriteInfoItem()
    )
    return Date.now() >= cacheItem.nextWrite
  }

  private async storeToCache(cache: BaseCache, data: Record<string, any>) {
    for (const [key, value] of Object.entries(data)) {
      const cacheKey = this.cacheKeyPrefix + ":data:" + key
      await cache.store(cacheKey, { key, value }, undefined)
    }
  }

  private async persistToDb(cache: BaseCache) {
    let doc: AnyDocument | undefined
    try {
      doc = await this.db.get(this.docId)
    } catch {
      doc = { _id: this.docId }
    }

    const keysToPersist = await cache.keys(`${this.cacheKeyPrefix}:data:*`)
    for (const key of keysToPersist) {
      const data = await cache.get(key, { useTenancy: false })
      doc[data.key] = data.value
    }

    await this.db.put(doc)

    for (const key of keysToPersist) {
      await cache.delete(key, { useTenancy: false })
    }
  }
}
