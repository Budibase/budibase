import {
  type Agent,
  type KnowledgeBase,
  RetrievalBackend,
} from "@budibase/types"
import { knowledgeBase } from ".."
import { BudibaseVectorRetrievalProvider } from "./providers/budibaseVector"
import { ManagedFileSearchRetrievalProvider } from "./providers/managedFileSearch"
import type { RetrievalProvider } from "./types"
import { utils } from "@budibase/shared-core"

const getRetrievalBackend = (config: KnowledgeBase | undefined) => {
  if (!config) {
    throw new Error("Knowledge base not found for retrieval")
  }

  if (!config.retrievalBackend) {
    throw new Error(`Knowledge base ${config._id} has no retrieval backend`)
  }

  return config.retrievalBackend
}

export const createRetrievalProviderForAgent = async (
  agent: Agent
): Promise<RetrievalProvider> => {
  const knowledgeBaseIds = (agent.knowledgeBases || []).filter(Boolean)
  if (knowledgeBaseIds.length === 0) {
    throw new Error("No knowledge bases configured for agent retrieval")
  }

  const knowledgeBases = await Promise.all(
    knowledgeBaseIds.map(
      async knowledgeBaseId => await knowledgeBase.find(knowledgeBaseId)
    )
  )

  const hasManagedFileSearchKnowledgeBase = knowledgeBases.some(kb => {
    const backend = getRetrievalBackend(kb)
    switch (backend) {
      case RetrievalBackend.MANAGED_FILE_SEARCH:
        return true
      case RetrievalBackend.BUDIBASE_VECTOR:
        return false
      default: {
        throw utils.unreachable(backend, {
          message: `Unsupported retrieval backend: ${backend}`,
        })
      }
    }
  })

  if (hasManagedFileSearchKnowledgeBase) {
    return new ManagedFileSearchRetrievalProvider()
  }

  return new BudibaseVectorRetrievalProvider()
}

export * from "./types"
