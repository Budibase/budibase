import BaseCache from "./base"
import { getDocWritethroughClient } from "../redis/init"
import { AnyDocument, Database, LockName, LockType } from "@budibase/types"

import { JobQueue, createQueue } from "../queue"
import * as dbUtils from "../db"
import { Duration, newid } from "../utils"
import { context, locks } from ".."

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
  messageId: string
}

export const docWritethroughProcessorQueue = createQueue<ProcessDocMessage>(
  JobQueue.DOC_WRITETHROUGH_QUEUE
)

docWritethroughProcessorQueue.process(async message => {
  const { cacheKeyPrefix, messageId } = message.data

  const cache = await getCache()
  const latestMessageId = await cache.get(
    REDIS_KEYS(cacheKeyPrefix).LATEST_MESSAGE_ID
  )
  if (messageId !== latestMessageId) {
    // Nothing to do, another message overrode it
    return
  }

  const lockResponse = await locks.doWithLock(
    {
      type: LockType.TRY_ONCE,
      name: LockName.PERSIST_WRITETHROUGH,
      resource: cacheKeyPrefix,
      ttl: Duration.fromSeconds(60).toMs(),
    },
    async () => {
      const latestMessageId = await cache.get(
        REDIS_KEYS(cacheKeyPrefix).LATEST_MESSAGE_ID
      )
      if (messageId !== latestMessageId) {
        // Nothing to do, another message overrode it
        return
      }

      await persistToDb(cache, message.data)
      console.log("DocWritethrough persisted", { data: message.data })
    }
  )

  if (!lockResponse.executed) {
    console.log(`Ignoring redlock conflict in write-through cache`)
  }
})

export async function persistToDb(
  cache: BaseCache,
  {
    dbName,
    docId,
    cacheKeyPrefix,
  }: {
    dbName: string
    docId: string
    cacheKeyPrefix: string
  }
) {
  const db = dbUtils.getDB(dbName)
  let doc: AnyDocument | undefined
  try {
    doc = await db.get(docId)
  } catch {
    doc = { _id: docId }
  }

  const keysToPersist = await cache.keys(
    REDIS_KEYS(cacheKeyPrefix).DATA.GET_ALL
  )
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
    const messageId = newid()
    await cache.store(
      REDIS_KEYS(this.cacheKeyPrefix).LATEST_MESSAGE_ID,
      messageId
    )

    docWritethroughProcessorQueue.add(
      {
        dbName: this.db.name,
        docId: this.docId,
        cacheKeyPrefix: this.cacheKeyPrefix,
        messageId,
      },
      {
        delay: this.writeRateMs,
      }
    )
  }

  private async storeToCache(cache: BaseCache, data: Record<string, any>) {
    data = Object.entries(data).reduce((acc, [key, value]) => {
      acc[REDIS_KEYS(this.cacheKeyPrefix).DATA.VALUE(key)] = { key, value }
      return acc
    }, {} as Record<string, any>)
    await cache.bulkStore(data, null)
  }
}

const REDIS_KEYS = (prefix: string) => ({
  DATA: {
    VALUE: (key: string) => prefix + ":data:" + key,
    GET_ALL: prefix + ":data:*",
  },
  LATEST_MESSAGE_ID: prefix + ":info:latestMessageId",
})
