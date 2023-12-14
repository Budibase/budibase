import BaseCache from "./base"
import { getWritethroughClient } from "../redis/init"
import { logWarn } from "../logging"
import { Database, Document, LockName, LockType } from "@budibase/types"
import * as locks from "../redis/redlockImpl"

const DEFAULT_WRITE_RATE_MS = 10000
let CACHE: BaseCache | null = null

interface CacheItem<T extends Document> {
  doc: any
  lastWrite: number
}

async function getCache() {
  if (!CACHE) {
    const client = await getWritethroughClient()
    CACHE = new BaseCache(client)
  }
  return CACHE
}

function makeCacheKey(db: Database, key: string) {
  return db.name + key
}

function makeCacheItem<T extends Document>(
  doc: T,
  lastWrite: number | null = null
): CacheItem<T> {
  return { doc, lastWrite: lastWrite || Date.now() }
}

async function put(
  db: Database,
  doc: Document,
  writeRateMs: number = DEFAULT_WRITE_RATE_MS
) {
  const cache = await getCache()
  const key = doc._id
  let cacheItem: CacheItem<any> | undefined
  if (key) {
    cacheItem = await cache.get(makeCacheKey(db, key))
  }
  const updateDb = !cacheItem || cacheItem.lastWrite < Date.now() - writeRateMs
  let output = doc
  if (updateDb) {
    const lockResponse = await locks.doWithLock(
      {
        type: LockType.TRY_ONCE,
        name: LockName.PERSIST_WRITETHROUGH,
        resource: key,
        ttl: 15000,
      },
      async () => {
        const writeDb = async (toWrite: any) => {
          // doc should contain the _id and _rev
          const response = await db.put(toWrite, { force: true })
          output._id = response.id
          output._rev = response.rev
        }
        try {
          await writeDb(doc)
        } catch (err: any) {
          if (err.status !== 409) {
            throw err
          } else {
            // Swallow 409s but log them
            logWarn(`Ignoring conflict in write-through cache`)
          }
        }
      }
    )

    if (!lockResponse.executed) {
      logWarn(`Ignoring redlock conflict in write-through cache`)
    }
  }
  // if we are updating the DB then need to set the lastWrite to now
  cacheItem = makeCacheItem(output, updateDb ? null : cacheItem?.lastWrite)
  if (output._id) {
    await cache.store(makeCacheKey(db, output._id), cacheItem)
  }
  return { ok: true, id: output._id, rev: output._rev }
}

async function get<T extends Document>(db: Database, id: string): Promise<T> {
  const cache = await getCache()
  const cacheKey = makeCacheKey(db, id)
  let cacheItem: CacheItem<T> = await cache.get(cacheKey)
  if (!cacheItem) {
    const doc = await db.get<T>(id)
    cacheItem = makeCacheItem(doc)
    await cache.store(cacheKey, cacheItem)
  }
  return cacheItem.doc
}

async function remove(db: Database, docOrId: any, rev?: any): Promise<void> {
  const cache = await getCache()
  if (!docOrId) {
    throw new Error("No ID/Rev provided.")
  }
  const id = typeof docOrId === "string" ? docOrId : docOrId._id
  rev = typeof docOrId === "string" ? rev : docOrId._rev
  try {
    await cache.delete(makeCacheKey(db, id))
  } finally {
    await db.remove(id, rev)
  }
}

export class Writethrough {
  db: Database
  writeRateMs: number

  constructor(db: Database, writeRateMs: number = DEFAULT_WRITE_RATE_MS) {
    this.db = db
    this.writeRateMs = writeRateMs
  }

  async put(doc: any, writeRateMs: number = this.writeRateMs) {
    return put(this.db, doc, writeRateMs)
  }

  async get<T extends Document>(id: string) {
    return get<T>(this.db, id)
  }

  async remove(docOrId: any, rev?: any) {
    return remove(this.db, docOrId, rev)
  }
}
