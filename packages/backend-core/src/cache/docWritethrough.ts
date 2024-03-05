import BaseCache from "./base"
import { getDocWritethroughClient } from "../redis/init"
import { AnyDocument, Database, LockName, LockType } from "@budibase/types"
import * as locks from "../redis/redlockImpl"

import { JobQueue, createQueue } from "../queue"
import * as context from "../context"
import * as dbUtils from "../db"

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
  const { tenantId, cacheKeyPrefix } = message.data
  await context.doInTenant(tenantId, async () => {
    const lockResponse = await locks.doWithLock(
      {
        type: LockType.TRY_ONCE,
        name: LockName.PERSIST_WRITETHROUGH,
        resource: cacheKeyPrefix,
        ttl: 15000,
      },
      async () => {
        await persistToDb(message.data)
        console.log("DocWritethrough persisted", { data: message.data })
      }
    )

    if (!lockResponse.executed) {
      console.log(`Ignoring redlock conflict in write-through cache`)
    }
  })
})

export async function persistToDb({
  dbName,
  docId,
  cacheKeyPrefix,
}: {
  dbName: string
  docId: string
  cacheKeyPrefix: string
}) {
  const cache = await getCache()

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

export class DocWritethrough {
  private db: Database
  private _docId: string
  private writeRateMs: number
  private tenantId: string

  private cacheKeyPrefix: string

  constructor(db: Database, docId: string, writeRateMs: number) {
    this.db = db
    this._docId = docId
    this.writeRateMs = writeRateMs
    this.cacheKeyPrefix = `${this.db.name}:${this.docId}`
    this.tenantId = context.getTenantId()
  }

  get docId() {
    return this._docId
  }

  async patch(data: Record<string, any>) {
    const cache = await getCache()

    await this.storeToCache(cache, data)

    docWritethroughProcessorQueue.add(
      {
        tenantId: this.tenantId,
        dbName: this.db.name,
        docId: this.docId,
        cacheKeyPrefix: this.cacheKeyPrefix,
      },
      {
        delay: this.writeRateMs,
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
