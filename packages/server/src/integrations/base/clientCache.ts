import { Duration, context } from "@budibase/backend-core"
import LRUCache from "lru-cache"
import crypto from "crypto"

type ClientCacheValue<T> = {
  destroy: (client: T) => Promise<void>
  // can't really know the type of the client, they are all so different
  client: T
}

const clientCache = new LRUCache<string, ClientCacheValue<any>>({
  // max 50 active clients per service
  max: 50,
  ttl: Duration.fromMinutes(10).toMs(),
  updateAgeOnGet: true,
  dispose: async (value: ClientCacheValue<any>) => {
    await value.destroy(value.client)
  },
})

// this class is used to define the implementation of disposal and type for each DS+
export class ClientCache<T> {
  destroy: (client: T) => Promise<void>

  constructor(destroy: (client: T) => Promise<void>) {
    this.destroy = destroy
  }

  hash(config: Record<string, any>) {
    const tenantId = context.getTenantId()
    const json = JSON.stringify(config)
    return crypto
      .createHash("sha256")
      .update(tenantId + json)
      .digest("base64")
  }

  get(configHash: string): T | undefined {
    const value = clientCache.get(configHash) as ClientCacheValue<T>
    if (value && value.client) {
      return value.client
    }
  }

  set(configHash: string, client: T) {
    clientCache.set(configHash, {
      destroy: this.destroy,
      client,
    })
  }
}
