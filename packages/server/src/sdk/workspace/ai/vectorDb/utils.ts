import { PgVectorDb } from "./pgVectorDb"
import type { VectorDb, VectorDbConfig } from "./types"

export const createVectorDb = (config: VectorDbConfig): VectorDb => {
  return new PgVectorDb(config)
}

export * from "./types"
