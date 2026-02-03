import { VectorDbProvider, type VectorDb as VectorDbDoc } from "@budibase/types"
import { buildPgVectorDbConfig } from "./pgVectorDb"
import type { VectorDb as VectorDbClient } from "./types"
import { utils } from "@budibase/shared-core"

export const createVectorDb = (
  config: VectorDbDoc,
  options: {
    agentId: string
  }
): VectorDbClient => {
  switch (config.provider) {
    case VectorDbProvider.PGVECTOR:
      return buildPgVectorDbConfig(config, {
        agentId: options.agentId,
      })

    default:
      throw utils.unreachable(config.provider, {
        message: `Unsupported vector db provider: ${config.provider}`,
      })
  }
}

export * from "./types"
