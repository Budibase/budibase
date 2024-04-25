import { Duration } from "@budibase/backend-core"
import LRUCache from "lru-cache"

interface Merkle {
  hash: (json: Record<string, any>) => string
  stringify: (json: Record<string, any>) => string
}

interface MerkleConstructor {
  new (): Merkle
}

// no typescript definition - fill it in
const { MerkleJson } = require("merkle-json") as {
  MerkleJson: MerkleConstructor
}

const jsonHash = new MerkleJson()

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
    return jsonHash.hash(config)
  }

  has(configHash: string): boolean {
    return clientCache.has(configHash)
  }

  get(configHash: string): T {
    if (!this.has(configHash)) {
      throw new Error("Cannot get client - missing a has check")
    }
    return clientCache.get(configHash) as T
  }

  set(configHash: string, client: T) {
    clientCache.set(configHash, {
      destroy: this.destroy,
      client,
    })
  }
}
