import BaseCache from "./base"
import { getDocWritethroughClient } from "../redis/init"
import { AnyDocument, Database, LockName, LockType } from "@budibase/types"
import * as locks from "../redis/redlockImpl"

import { JobQueue, createQueue } from "../queue"
import { context, db as dbUtils } from ".."

const DEFAULT_WRITE_RATE_MS = 10000

let CACHE: BaseCache | null = null
async function getCache() {
  if (!CACHE) {
    const client = await getDocWritethroughClient()
    CACHE = new BaseCache(client)
  }
  return CACHE
}

interface ProcessDocMessage {
  tenantId: string
  dbName: string
  docId: string
  cacheKeyPrefix: string
}

export const docWritethroughProcessorQueue = createQueue<ProcessDocMessage>(
  JobQueue.DOC_WRITETHROUGH_QUEUE
)

docWritethroughProcessorQueue.process(async message => {
  const { dbName, tenantId, docId, cacheKeyPrefix } = message.data
  const cache = await getCache()
  await context.doInTenant(tenantId, async () => {
    const lockResponse = await locks.doWithLock(
      {
        type: LockType.TRY_ONCE,
        name: LockName.PERSIST_WRITETHROUGH,
        resource: cacheKeyPrefix,
        ttl: 15000,
      },
      async () => {
        const db = dbUtils.getDB(dbName)
        let doc: AnyDocument | undefined
        try {
          doc = await db.get(docId)
        } catch {
          doc = { _id: docId }
        }

        const keysToPersist = await cache.keys(`${cacheKeyPrefix}:data:*`)
        for (const key of keysToPersist) {
          const data = await cache.get(key, { useTenancy: false })
          doc[data.key] = data.value
        }

        await db.put(doc)

        for (const key of keysToPersist) {
          await cache.delete(key, { useTenancy: false })
        }
      }
    )

    if (!lockResponse.executed) {
      console.log(`Ignoring redlock conflict in write-through cache`)
    }
  })
})

export class DocWritethrough {
  private db: Database
  private _docId: string
  private writeRateMs: number

  private cacheKeyPrefix: string

  constructor(
    db: Database,
    docId: string,
    writeRateMs: number = DEFAULT_WRITE_RATE_MS
  ) {
    this.db = db
    this._docId = docId
    this.writeRateMs = writeRateMs
    this.cacheKeyPrefix = `${this.db.name}:${this.docId}`
  }

  get docId() {
    return this._docId
  }

  async patch(data: Record<string, any>) {
    const cache = await getCache()

    await this.storeToCache(cache, data)

    docWritethroughProcessorQueue.add(
      {
        tenantId: context.getTenantId(),
        dbName: this.db.name,
        docId: this.docId,
        cacheKeyPrefix: this.cacheKeyPrefix,
      },
      {
        delay: this.writeRateMs - 1,
        jobId: this.cacheKeyPrefix,
        removeOnFail: true,
        removeOnComplete: true,
      }
    )
  }

  private async storeToCache(cache: BaseCache, data: Record<string, any>) {
    for (const [key, value] of Object.entries(data)) {
      const cacheKey = this.cacheKeyPrefix + ":data:" + key
      await cache.store(cacheKey, { key, value }, undefined)
    }
  }
}
