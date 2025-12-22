import { PgVectorStore } from "./pgVectorStore"
import type { VectorDb, VectorStoreConfig } from "./types"

export const createVectorStore = (config: VectorStoreConfig): VectorDb => {
  return new PgVectorStore(config)
}

export * from "./types"
