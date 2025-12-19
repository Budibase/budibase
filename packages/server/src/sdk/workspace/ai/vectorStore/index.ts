import type { VectorStore, VectorStoreConfig } from "./types"
import { PgVectorStore } from "./pgVectorStore"

export const createVectorStore = (
  config: VectorStoreConfig
): VectorStore => {
  return new PgVectorStore(config)
}

export * from "./types"
