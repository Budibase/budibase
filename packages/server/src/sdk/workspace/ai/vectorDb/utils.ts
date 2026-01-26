import type { VectorDb as VectorDbDoc } from "@budibase/types"
import { buildPgVectorDbConfig, PgVectorDb } from "./pgVectorDb"
import type {
  VectorDb as VectorDbClient,
  VectorDbRuntimeOptions,
} from "./types"

export const createVectorDb = (
  config: VectorDbDoc,
  options: VectorDbRuntimeOptions
): VectorDbClient => {
  switch (config.provider) {
    case "pgvector":
      return new PgVectorDb(buildPgVectorDbConfig(config, options))
    default:
      throw new Error(`Unsupported vector db provider: ${config.provider}`)
  }
}

export * from "./types"
