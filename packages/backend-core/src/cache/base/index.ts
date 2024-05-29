import { getTenantId } from "../../context"
import * as redis from "../../redis/init"
import { Client } from "../../redis"

function generateTenantKey(key: string) {
  const tenantId = getTenantId()
  return `${key}:${tenantId}`
}

export default class BaseCache {
  client: Client | undefined

  constructor(client: Client | undefined = undefined) {
    this.client = client
  }

  async getClient() {
    return !this.client ? await redis.getCacheClient() : this.client
  }

  async keys(pattern: string) {
    const client = await this.getClient()
    return client.keys(pattern)
  }

  async exists(key: string, opts = { useTenancy: true }) {
    key = opts.useTenancy ? generateTenantKey(key) : key
    const client = await this.getClient()
    return client.exists(key)
  }

  async scan(key: string, opts = { useTenancy: true }) {
    key = opts.useTenancy ? generateTenantKey(key) : key
    const client = await this.getClient()
    return client.scan(key)
  }

  /**
   * Read only from the cache.
   */
  async get(key: string, opts = { useTenancy: true }) {
    key = opts.useTenancy ? generateTenantKey(key) : key
    const client = await this.getClient()
    return client.get(key)
  }

  /**
   * Read only from the cache.
   */
  async bulkGet<T>(keys: string[], opts = { useTenancy: true }) {
    keys = opts.useTenancy ? keys.map(key => generateTenantKey(key)) : keys
    const client = await this.getClient()
    return client.bulkGet<T>(keys)
  }

  /**
   * Write to the cache.
   */
  async store(
    key: string,
    value: any,
    ttl: number | null = null,
    opts = { useTenancy: true }
  ) {
    key = opts.useTenancy ? generateTenantKey(key) : key
    const client = await this.getClient()
    await client.store(key, value, ttl)
  }

  /**
   * Bulk write to the cache.
   */
  async bulkStore(
    data: Record<string, any>,
    ttl: number | null = null,
    opts = { useTenancy: true }
  ) {
    if (opts.useTenancy) {
      data = Object.entries(data).reduce((acc, [key, value]) => {
        acc[generateTenantKey(key)] = value
        return acc
      }, {} as Record<string, any>)
    }

    const client = await this.getClient()
    await client.bulkStore(data, ttl)
  }

  /**
   * Remove from cache.
   */
  async delete(key: string, opts = { useTenancy: true }) {
    key = opts.useTenancy ? generateTenantKey(key) : key
    const client = await this.getClient()
    return client.delete(key)
  }

  /**
   * Remove from cache.
   */
  async bulkDelete(keys: string[], opts = { useTenancy: true }) {
    keys = opts.useTenancy ? keys.map(key => generateTenantKey(key)) : keys
    const client = await this.getClient()
    return client.bulkDelete(keys)
  }

  /**
   * Read from the cache. Write to the cache if not exists.
   */
  async withCache<T>(
    key: string,
    ttl: number | null = null,
    fetchFn: () => Promise<T> | T,
    opts = { useTenancy: true }
  ): Promise<T> {
    const cachedValue = await this.get(key, opts)
    if (cachedValue) {
      return cachedValue
    }

    try {
      const fetchedValue = await fetchFn()

      await this.store(key, fetchedValue, ttl, opts)
      return fetchedValue
    } catch (err) {
      console.error("Error fetching before cache - ", err)
      throw err
    }
  }

  async bustCache(key: string) {
    const client = await this.getClient()
    try {
      await client.delete(generateTenantKey(key))
    } catch (err) {
      console.error("Error busting cache - ", err)
      throw err
    }
  }

  /**
   * Delete the entry if the provided value matches the stored one.
   */
  async deleteIfValue(key: string, value: any, opts = { useTenancy: true }) {
    key = opts.useTenancy ? generateTenantKey(key) : key
    const client = await this.getClient()
    await client.deleteIfValue(key, value)
  }
}
