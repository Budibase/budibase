import BaseCache from "./base"
import { getDocWritethroughClient } from "../redis/init"
import { AnyDocument, Database } from "@budibase/types"

import { JobQueue, createQueue } from "../queue"
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
  dbName: string
  docId: string
  cacheKeyPrefix: string
}

export const docWritethroughProcessorQueue = createQueue<ProcessDocMessage>(
  JobQueue.DOC_WRITETHROUGH_QUEUE
)

docWritethroughProcessorQueue.process(async message => {
  await persistToDb(message.data)
  console.log("DocWritethrough persisted", { data: message.data })
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

  private cacheKeyPrefix: string

  constructor(db: Database, docId: string, writeRateMs: number) {
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
    data = Object.entries(data).reduce((acc, [key, value]) => {
      acc[this.cacheKeyPrefix + ":data:" + key] = { key, value }
      return acc
    }, {} as Record<string, any>)
    await cache.bulkStore(data, null)
  }
}
