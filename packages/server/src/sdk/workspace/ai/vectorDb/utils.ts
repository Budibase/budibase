import { VectorDbProvider } from "@budibase/types"
import { buildPgVectorDbConfig, resolvePgVectorDbConfig } from "./pgVectorDb"
import type { VectorDb as VectorDbClient } from "./types"
import { utils } from "@budibase/shared-core"
import sdk from "../../.."

export const createVectorDb = async ({
  namespaceId,
  vectorDbId,
}: {
  namespaceId: string
  vectorDbId: string | undefined
}): Promise<VectorDbClient> => {
  if (!vectorDbId) {
    throw new Error("Vectordb id not set")
  }

  const vectorDb = await sdk.ai.vectorDb.find(vectorDbId)
  if (!vectorDb) {
    throw new Error("Vector db not found")
  }
  switch (vectorDb.provider) {
    case VectorDbProvider.PGVECTOR:
      return buildPgVectorDbConfig(await resolvePgVectorDbConfig(vectorDb), {
        namespaceId,
      })

    default:
      throw utils.unreachable(vectorDb.provider, {
        message: `Unsupported vector db provider: ${vectorDb.provider}`,
      })
  }
}

export * from "./types"
