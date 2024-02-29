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
  lastWrite: number
}

export class DocWritethrough {
  db: Database
  docId: string
  writeRateMs: number

  constructor(
    db: Database,
    docId: string,
    writeRateMs: number = DEFAULT_WRITE_RATE_MS
  ) {
    this.db = db
    this.docId = docId
    this.writeRateMs = writeRateMs
  }

  private makeCacheItem(): CacheItem {
    return { lastWrite: Date.now() }
  }

  async patch(data: Record<string, any>) {
    const cache = await getCache()

    const key = `${this.docId}:info`
    const cacheItem = await cache.withCache(
      key,
      null,
      () => this.makeCacheItem(),
      {
        useTenancy: false,
      }
    )

    await this.storeToCache(cache, data)

    const updateDb =
      !cacheItem || cacheItem.lastWrite <= Date.now() - this.writeRateMs
    // let output = this.doc
    if (updateDb) {
      await this.persistToDb(cache)
    }
  }

  private async storeToCache(cache: BaseCache, data: Record<string, any>) {
    for (const [key, value] of Object.entries(data)) {
      const cacheKey = this.docId + ":data:" + key
      await cache.store(cacheKey, { key, value }, undefined)
    }
  }

  private async persistToDb(cache: BaseCache) {
    const key = `${this.db.name}_${this.docId}`

    const lockResponse = await locks.doWithLock(
      {
        type: LockType.TRY_ONCE,
        name: LockName.PERSIST_WRITETHROUGH,
        resource: key,
        ttl: 15000,
      },
      async () => {
        let doc: AnyDocument | undefined
        try {
          doc = await this.db.get(this.docId)
        } catch {
          doc = { _id: this.docId }
        }

        const keysToPersist = await cache.keys(`${this.docId}:data:*`)
        for (const key of keysToPersist) {
          const data = await cache.get(key, { useTenancy: false })
          doc[data.key] = data.value
        }

        await this.db.put(doc)
      }
    )

    if (!lockResponse.executed) {
      throw `DocWriteThrough could not be persisted to db for ${key}`
    }
  }
}
