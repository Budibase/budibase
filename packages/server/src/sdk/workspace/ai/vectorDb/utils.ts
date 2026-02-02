import type { VectorDb as VectorDbDoc } from "@budibase/types"
import { buildPgVectorDbConfig, PgVectorDb } from "./pgVectorDb"
import type { VectorDb as VectorDbClient } from "./types"

export const createVectorDb = (
  config: VectorDbDoc,
  options: {
    agentId: string
  }
): VectorDbClient => {
  switch (config.provider) {
    case "pgvector":
      return new PgVectorDb(
        buildPgVectorDbConfig(config, {
          agentId: options.agentId,
        })
      )
    default:
      throw new Error(`Unsupported vector db provider: ${config.provider}`)
  }
}

export * from "./types"
