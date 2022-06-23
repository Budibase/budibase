import BaseCache from "./base"
import { getWritethroughClient } from "../redis/init"

const DEFAULT_WRITE_RATE_MS = 10000
let CACHE: BaseCache | null = null

interface CacheItem {
  value: any
  lastWrite: number
}

async function getCache() {
  if (!CACHE) {
    const client = await getWritethroughClient()
    CACHE = new BaseCache(client)
  }
  return CACHE
}

function makeCacheItem(value: any, lastWrite: number | null = null): CacheItem {
  return { value, lastWrite: lastWrite || Date.now() }
}

exports.put = async (
  db: PouchDB.Database,
  value: any,
  writeRateMs: number = DEFAULT_WRITE_RATE_MS
) => {
  const cache = await getCache()
  const key = value._id
  let cacheItem: CacheItem | undefined = await cache.get(key)
  const updateDb = !cacheItem || cacheItem.lastWrite < Date.now() - writeRateMs
  let output = value
  if (updateDb) {
    // value should contain the _id and _rev
    const response = await db.put(value)
    output = {
      ...value,
      _id: response.id,
      _rev: response.rev,
    }
  }
  // if we are updating the DB then need to set the lastWrite to now
  cacheItem = makeCacheItem(value, updateDb ? null : cacheItem?.lastWrite)
  await cache.store(key, cacheItem)
  return output
}

exports.get = async (db: PouchDB.Database, id: string): Promise<any> => {
  const cache = await getCache()
  let cacheItem: CacheItem = await cache.get(id)
  if (!cacheItem) {
    const value = await db.get(id)
    cacheItem = makeCacheItem(value)
    await cache.store(id, cacheItem)
  }
  return cacheItem.value
}
