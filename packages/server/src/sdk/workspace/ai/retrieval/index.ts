import {
  type Agent,
  type KnowledgeBase,
  KnowledgeBaseType,
} from "@budibase/types"
import { knowledgeBase } from ".."
import { BudibaseVectorRetrievalProvider } from "./providers/budibaseVector"
import { ManagedFileSearchRetrievalProvider } from "./providers/managedFileSearch"
import type { RetrievalProvider } from "./types"
import { utils } from "@budibase/shared-core"

const getKnowledgeBaseType = (config: KnowledgeBase | undefined) => {
  if (!config) {
    throw new Error("Knowledge base not found for retrieval")
  }

  if (!config.type) {
    throw new Error(`Knowledge base ${config._id} has no knowledge type`)
  }

  return config.type
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

  const hasConnectorKnowledgeBase = knowledgeBases.some(kb => {
    const type = getKnowledgeBaseType(kb)
    switch (type) {
      case KnowledgeBaseType.SHAREPOINT:
      case KnowledgeBaseType.GOOGLE_DRIVE:
      case KnowledgeBaseType.CONFLUENCE:
        return true
      case KnowledgeBaseType.LOCAL:
        return false
      default: {
        throw utils.unreachable(type, {
          message: `Unsupported knowledge base type: ${type}`,
        })
      }
    }
  })

  if (hasConnectorKnowledgeBase) {
    return new ManagedFileSearchRetrievalProvider()
  }

  return new BudibaseVectorRetrievalProvider()
}

export * from "./types"
